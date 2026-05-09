// Google Cloud Text-to-Speech wrapper (ADR 003)
// Uses Wavenet voices with SSML mark-based word timestamps for read-along highlighting.

export interface WordTimestamp {
  word: string
  start_ms: number
  end_ms: number
}

export interface TtsResult {
  audioBase64: string
  wordTimestamps: WordTimestamp[]
}

// Voice names per language (ADR 003 — Google Wavenet chosen for Indian language quality)
const VOICES: Record<string, { languageCode: string; name: string }> = {
  hi: { languageCode: 'hi-IN', name: 'hi-IN-Wavenet-D' },
  en: { languageCode: 'en-IN', name: 'en-IN-Wavenet-A' },
  gu: { languageCode: 'gu-IN', name: 'gu-IN-Wavenet-A' },
  mr: { languageCode: 'mr-IN', name: 'mr-IN-Wavenet-A' },
  ta: { languageCode: 'ta-IN', name: 'ta-IN-Wavenet-A' },
  te: { languageCode: 'te-IN', name: 'te-IN-Wavenet-A' },
  bn: { languageCode: 'bn-IN', name: 'bn-IN-Wavenet-A' },
  kn: { languageCode: 'kn-IN', name: 'kn-IN-Wavenet-A' },
}

// Wraps each word in an SSML <mark> so Google TTS returns per-word time offsets.
function buildSsml(text: string): { ssml: string; words: string[] } {
  const words = text.trim().split(/\s+/).filter(Boolean)
  const body = words.map((w, i) => `<mark name="w${i}"/>${w}`).join(' ')
  return { ssml: `<speak>${body}</speak>`, words }
}

export async function synthesize(
  text: string,
  lang: string,
  accessToken: string,
): Promise<TtsResult> {
  const voice = VOICES[lang]
  if (!voice) throw new Error(`No voice configured for language: ${lang}`)

  const { ssml, words } = buildSsml(text)

  const res = await fetch('https://texttospeech.googleapis.com/v1/text:synthesize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      input: { ssml },
      voice,
      audioConfig: { audioEncoding: 'MP3' },
      enableTimePointing: ['SSML_MARK'],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`TTS API error for lang=${lang}: ${err}`)
  }

  const data = await res.json()
  const timepoints: { markName: string; timeSeconds: number }[] = data.timepoints ?? []

  // Convert SSML marks to word timestamps; end_ms = next word's start (or +500ms for last word)
  const wordTimestamps: WordTimestamp[] = timepoints.map((tp, i) => {
    const wordIndex = parseInt(tp.markName.slice(1))
    const start_ms = Math.round(tp.timeSeconds * 1000)
    const end_ms = timepoints[i + 1]
      ? Math.round(timepoints[i + 1].timeSeconds * 1000)
      : start_ms + 500
    return { word: words[wordIndex] ?? '', start_ms, end_ms }
  })

  return { audioBase64: data.audioContent, wordTimestamps }
}
