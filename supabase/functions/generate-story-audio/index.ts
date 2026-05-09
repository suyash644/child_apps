// Edge Function: generate-story-audio
// Called by the admin panel "Generate Audio" button (ADR 005, 009).
// For each slide in the story, calls Google TTS for every populated language,
// uploads the MP3 to Supabase Storage, and writes audio_urls + word_timestamps back to the DB.
//
// Required environment variables (set via `supabase secrets set`):
//   GOOGLE_SERVICE_ACCOUNT_JSON  — full service account JSON key as a string
//   SUPABASE_URL                 — auto-injected by Supabase
//   SUPABASE_SERVICE_ROLE_KEY    — auto-injected by Supabase

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { getGoogleAccessToken } from './google-auth.ts'
import { synthesize } from './tts.ts'

// Phase 1 languages. Add 'gu','mr','ta','te' for Phase 2, etc.
const ACTIVE_LANGUAGES = ['hi', 'en']

const STORAGE_BUCKET = 'story-audio'

serve(async (req) => {
  // Only allow POST
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  // Verify the caller is an authenticated admin user
  const authHeader = req.headers.get('Authorization')
  if (!authHeader) return new Response('Unauthorized', { status: 401 })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  )

  // Validate the JWT from the admin panel
  const token = authHeader.replace('Bearer ', '')
  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) return new Response('Unauthorized', { status: 401 })

  // Confirm the caller has an admin role
  const { data: profile } = await supabase
    .from('profiles')
    .select('admin_role')
    .eq('id', user.id)
    .single()

  if (!profile?.admin_role) return new Response('Forbidden', { status: 403 })

  // Parse request body
  const { story_id } = await req.json()
  if (!story_id) return new Response('story_id is required', { status: 400 })

  // Confirm story exists and is published (only published stories get audio — ADR 010)
  const { data: story } = await supabase
    .from('stories')
    .select('id, status')
    .eq('id', story_id)
    .single()

  if (!story) return new Response('Story not found', { status: 404 })
  if (story.status !== 'published') {
    return new Response('Story must be published before generating audio', { status: 422 })
  }

  // Fetch all slides ordered by index
  const { data: slides, error: slidesError } = await supabase
    .from('story_slides')
    .select('id, slide_index, content, audio_urls, word_timestamps')
    .eq('story_id', story_id)
    .order('slide_index')

  if (slidesError || !slides?.length) {
    return new Response('No slides found for this story', { status: 404 })
  }

  // Get Google access token once and reuse for all TTS calls
  const serviceAccountJson = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_JSON')
  if (!serviceAccountJson) {
    return new Response('GOOGLE_SERVICE_ACCOUNT_JSON not configured', { status: 500 })
  }

  const accessToken = await getGoogleAccessToken(serviceAccountJson)

  type SlideResult = { slide_index: number; lang: string; status: 'ok' | 'skipped' | 'error'; error?: string }
  const results: SlideResult[] = []

  for (const slide of slides) {
    const content = slide.content as Record<string, string>
    const currentAudioUrls = (slide.audio_urls ?? {}) as Record<string, string>
    const currentTimestamps = (slide.word_timestamps ?? {}) as Record<string, unknown>

    const updatedAudioUrls = { ...currentAudioUrls }
    const updatedTimestamps = { ...currentTimestamps }

    for (const lang of ACTIVE_LANGUAGES) {
      const text = content[lang]

      // Skip languages with no content
      if (!text?.trim()) {
        results.push({ slide_index: slide.slide_index, lang, status: 'skipped' })
        continue
      }

      try {
        const { audioBase64, wordTimestamps } = await synthesize(text, lang, accessToken)

        // Decode base64 MP3 and upload to Supabase Storage
        const audioBytes = Uint8Array.from(atob(audioBase64), (c) => c.charCodeAt(0))
        const storagePath = `stories/${story_id}/${slide.id}_${lang}.mp3`

        const { error: uploadError } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(storagePath, audioBytes, {
            contentType: 'audio/mpeg',
            upsert: true, // overwrite if regenerating
          })

        if (uploadError) throw new Error(uploadError.message)

        const { data: urlData } = supabase.storage
          .from(STORAGE_BUCKET)
          .getPublicUrl(storagePath)

        updatedAudioUrls[lang] = urlData.publicUrl
        updatedTimestamps[lang] = wordTimestamps

        results.push({ slide_index: slide.slide_index, lang, status: 'ok' })
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err)
        results.push({ slide_index: slide.slide_index, lang, status: 'error', error: message })
      }
    }

    // Write updated audio_urls and word_timestamps back to the slide row
    await supabase
      .from('story_slides')
      .update({ audio_urls: updatedAudioUrls, word_timestamps: updatedTimestamps })
      .eq('id', slide.id)
  }

  const failed = results.filter((r) => r.status === 'error')

  return new Response(
    JSON.stringify({
      story_id,
      total: results.length,
      ok: results.filter((r) => r.status === 'ok').length,
      skipped: results.filter((r) => r.status === 'skipped').length,
      failed: failed.length,
      errors: failed,
    }),
    {
      status: failed.length > 0 ? 207 : 200, // 207 Multi-Status for partial failures
      headers: { 'Content-Type': 'application/json' },
    },
  )
})
