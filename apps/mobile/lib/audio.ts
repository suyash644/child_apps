// Audio cache manager (ADR 013)
// Downloads MP3 files to the local filesystem before playback so stories
// work uninterrupted on slow / unreliable Indian mobile networks.
// Cache cap: 150 MB. Oldest-played stories are evicted first.

import * as FileSystem from 'expo-file-system'

const CACHE_DIR = `${FileSystem.cacheDirectory}story-audio/`
const CACHE_INDEX_KEY = `${CACHE_DIR}index.json`
const MAX_CACHE_BYTES = 150 * 1024 * 1024 // 150 MB

interface CacheEntry {
  storyId: string
  localUri: string
  bytes: number
  lastPlayedAt: number
}

async function ensureCacheDir() {
  const info = await FileSystem.getInfoAsync(CACHE_DIR)
  if (!info.exists) await FileSystem.makeDirectoryAsync(CACHE_DIR, { intermediates: true })
}

async function readIndex(): Promise<CacheEntry[]> {
  try {
    const raw = await FileSystem.readAsStringAsync(CACHE_INDEX_KEY)
    return JSON.parse(raw)
  } catch {
    return []
  }
}

async function writeIndex(index: CacheEntry[]) {
  await FileSystem.writeAsStringAsync(CACHE_INDEX_KEY, JSON.stringify(index))
}

async function evictIfNeeded(index: CacheEntry[], incomingBytes: number) {
  const total = index.reduce((sum, e) => sum + e.bytes, 0)
  if (total + incomingBytes <= MAX_CACHE_BYTES) return index

  // Sort oldest-played first, delete until we have room
  const sorted = [...index].sort((a, b) => a.lastPlayedAt - b.lastPlayedAt)
  let freed = 0
  const toDelete: CacheEntry[] = []

  for (const entry of sorted) {
    if (total + incomingBytes - freed <= MAX_CACHE_BYTES) break
    toDelete.push(entry)
    freed += entry.bytes
  }

  await Promise.all(toDelete.map((e) => FileSystem.deleteAsync(e.localUri, { idempotent: true })))
  return index.filter((e) => !toDelete.includes(e))
}

// Returns a local file:// URI for the audio, downloading it if needed.
export async function getAudioUri(remoteUrl: string, storyId: string, slideId: string, lang: string): Promise<string> {
  await ensureCacheDir()

  const filename = `${slideId}_${lang}.mp3`
  const localUri = `${CACHE_DIR}${storyId}/`
  const localPath = `${localUri}${filename}`

  const info = await FileSystem.getInfoAsync(localPath)
  if (info.exists) {
    // Update last-played timestamp in index
    const index = await readIndex()
    const entry = index.find((e) => e.localUri === localPath)
    if (entry) {
      entry.lastPlayedAt = Date.now()
      await writeIndex(index)
    }
    return localPath
  }

  // Download the file
  await FileSystem.makeDirectoryAsync(localUri, { intermediates: true })
  const download = await FileSystem.downloadAsync(remoteUrl, localPath)

  const fileInfo = await FileSystem.getInfoAsync(localPath, { size: true })
  const bytes = fileInfo.exists && 'size' in fileInfo ? fileInfo.size : 0

  let index = await readIndex()
  index = await evictIfNeeded(index, bytes)
  index.push({ storyId, localUri: localPath, bytes, lastPlayedAt: Date.now() })
  await writeIndex(index)

  return download.uri
}

// Pre-downloads all slide audio for a story before the user starts playing.
// Called when a story screen mounts so audio is ready by slide 1.
export async function prefetchStoryAudio(
  slides: Array<{ id: string; audio_urls: Partial<Record<string, string>> }>,
  storyId: string,
  lang: string,
) {
  for (const slide of slides) {
    const url = slide.audio_urls?.[lang]
    if (url) {
      getAudioUri(url, storyId, slide.id, lang).catch(() => {
        // Prefetch failures are silent — playback will try the remote URL as fallback
      })
    }
  }
}
