'use client'

import { useState } from 'react'

interface Props {
  storyId: string
}

export default function GenerateAudioButton({ storyId }: Props) {
  const [status, setStatus] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')

  async function generate() {
    setStatus('loading')
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_PB_URL}/api/generate-story-audio`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ story_id: storyId }),
        }
      )
      setStatus(res.ok ? 'done' : 'error')
      if (res.ok) setTimeout(() => setStatus('idle'), 3000)
    } catch {
      setStatus('error')
    }
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
