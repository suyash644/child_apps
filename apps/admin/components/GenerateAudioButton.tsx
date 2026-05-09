'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Props {
  storyId: string
}

export default function GenerateAudioButton({ storyId }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const supabase = createClient()

  async function generate() {
    setStatus('loading')
    const { error } = await supabase.functions.invoke('generate-story-audio', {
      body: { story_id: storyId },
    })
    setStatus(error ? 'error' : 'done')
    if (!error) setTimeout(() => setStatus('idle'), 3000)
  }

  return (
    <button
      onClick={generate}
      disabled={status === 'loading'}
      className={`text-sm font-medium px-4 py-2 rounded-lg border transition-colors ${
        status === 'done'
          ? 'bg-green-50 text-green-700 border-green-200'
          : status === 'error'
          ? 'bg-red-50 text-red-700 border-red-200'
          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
      } disabled:opacity-50`}
      title="Generates MP3 audio for all slides in all active languages using Google TTS"
    >
      {status === 'loading' && 'Generating audio…'}
      {status === 'done'    && 'Audio generated'}
      {status === 'error'   && 'Generation failed — retry'}
      {status === 'idle'    && 'Generate Audio'}
    </button>
  )
}
