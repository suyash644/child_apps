import { useEffect, useState } from 'react'
import {
  View, Text, Pressable, Image, StyleSheet, ActivityIndicator, SafeAreaView,
} from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { useStore } from '@/lib/store'
import { useStory } from '@/hooks/useStories'
import { prefetchStoryAudio } from '@/lib/audio'
import { getText } from '@/lib/i18n'
import AudioPlayer from '@/components/AudioPlayer'
import { supabase } from '@/lib/supabase'
import type { LanguageCode } from '@/lib/i18n'

export default function StoryPlayerScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const lang = useStore((s) => s.lang) as LanguageCode
  const activeChild = useStore((s) => s.activeChild)
  const setLastStory = useStore((s) => s.setLastStory)

  const { data: story, isLoading, isError } = useStory(id)
  const [slideIndex, setSlideIndex] = useState(0)

  // Pre-cache audio for all slides when the story loads (ADR 013)
  useEffect(() => {
    if (story?.story_slides) {
      prefetchStoryAudio(story.story_slides, story.id, lang)
    }
  }, [story, lang])

  // Persist resume position
  useEffect(() => {
    if (activeChild && id) setLastStory(activeChild.id, id, slideIndex)
  }, [slideIndex, activeChild, id, setLastStory])

  async function recordProgress(status: 'started' | 'completed') {
    if (!activeChild) return
    await supabase.from('user_progress').upsert({
      child_id: activeChild.id,
      entity_type: 'story',
      entity_id: id,
      status,
      last_slide_index: slideIndex,
    }, { onConflict: 'child_id,entity_type,entity_id' })
  }

  useEffect(() => { recordProgress('started') }, [])

  function handleSlideComplete() {
    if (!story) return
    if (slideIndex < story.story_slides.length - 1) {
      setSlideIndex((i) => i + 1)
    } else {
      recordProgress('completed')
    }
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FF6B00" />
      </View>
    )
  }

  if (isError || !story) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Could not load story.</Text>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>Go back</Text>
        </Pressable>
      </View>
    )
  }

  const slide = story.story_slides[slideIndex]
  const slideText = getText(slide?.content, lang)
  const audioUrl = slide?.audio_urls?.[lang]
  const wordTimestamps = (slide?.word_timestamps?.[lang] as any[]) ?? []
  const isLastSlide = slideIndex === story.story_slides.length - 1
  const title = getText(story.title, lang)

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.closeBtn}>
          <Text style={styles.closeIcon}>✕</Text>
        </Pressable>
        <Text style={styles.storyTitle} numberOfLines={1}>{title}</Text>
        {/* Slide progress dots */}
        <View style={styles.dots}>
          {story.story_slides.map((_, i) => (
            <View
              key={i}
              style={[styles.dot, i === slideIndex && styles.dotActive, i < slideIndex && styles.dotDone]}
            />
          ))}
        </View>
      </View>

      {/* Slide illustration */}
      {slide?.image_url ? (
        <Image source={{ uri: slide.image_url }} style={styles.illustration} resizeMode="cover" />
      ) : (
        <View style={styles.illustrationPlaceholder}>
          <Text style={styles.illustrationEmoji}>🪔</Text>
        </View>
      )}

      {/* Audio player with word highlighting */}
      <View style={styles.playerArea}>
        <AudioPlayer
          key={slide?.id}
          storyId={story.id}
          slideId={slide?.id ?? ''}
          text={slideText}
          audioUrl={audioUrl}
          wordTimestamps={wordTimestamps}
          lang={lang}
          onSlideComplete={handleSlideComplete}
        />
      </View>

      {/* Navigation */}
      <View style={styles.nav}>
        <Pressable
          onPress={() => setSlideIndex((i) => Math.max(0, i - 1))}
          disabled={slideIndex === 0}
          style={({ pressed }) => [styles.navBtn, slideIndex === 0 && styles.navBtnDisabled, pressed && styles.pressed]}
        >
          <Text style={styles.navBtnText}>← Prev</Text>
        </Pressable>

        <Text style={styles.slideCounter}>
          {slideIndex + 1} / {story.story_slides.length}
        </Text>

        {isLastSlide ? (
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [styles.navBtn, styles.navBtnFinish, pressed && styles.pressed]}
          >
            <Text style={[styles.navBtnText, styles.navBtnFinishText]}>Finish ✓</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={() => setSlideIndex((i) => i + 1)}
            style={({ pressed }) => [styles.navBtn, pressed && styles.pressed]}
          >
            <Text style={styles.navBtnText}>Next →</Text>
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { color: '#e53e3e', marginBottom: 16 },
  backBtn: { backgroundColor: '#FF6B00', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  backBtnText: { color: '#fff', fontWeight: '600' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8, gap: 10 },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#f5f5f5', alignItems: 'center', justifyContent: 'center' },
  closeIcon: { fontSize: 14, color: '#555' },
  storyTitle: { flex: 1, fontSize: 15, fontWeight: '600', color: '#1a1a1a' },
  dots: { flexDirection: 'row', gap: 4 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#e0e0e0' },
  dotActive: { backgroundColor: '#FF6B00', width: 16 },
  dotDone: { backgroundColor: '#FF6B00', opacity: 0.4 },
  illustration: { width: '100%', height: 220 },
  illustrationPlaceholder: { height: 220, backgroundColor: '#FFF3E0', alignItems: 'center', justifyContent: 'center' },
  illustrationEmoji: { fontSize: 72 },
  playerArea: { flex: 1, padding: 24 },
  nav: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  navBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10, backgroundColor: '#f5f5f5' },
  navBtnDisabled: { opacity: 0.3 },
  navBtnFinish: { backgroundColor: '#FF6B00' },
  navBtnText: { fontWeight: '600', color: '#1a1a1a', fontSize: 14 },
  navBtnFinishText: { color: '#fff' },
  slideCounter: { fontSize: 13, color: '#aaa' },
  pressed: { opacity: 0.8 },
})
