// React Query hooks for stories (ADR 013: 24-hour cache)

import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { LanguageCode } from '@/lib/i18n'

export type AgeGroup = 'tiny_devotee' | 'young_scholar' | 'dharma_scholar'

export interface StoryListItem {
  id: string
  category: string
  age_group: AgeGroup
  title: Record<string, string>
  description: Record<string, string>
  thumbnail_url: string | null
  is_premium: boolean
}

export interface StorySlide {
  id: string
  slide_index: number
  content: Record<string, string>
  image_url: string | null
  audio_urls: Partial<Record<LanguageCode, string>>
  word_timestamps: Record<string, Array<{ word: string; start_ms: number; end_ms: number }>>
}

export interface StoryDetail extends StoryListItem {
  story_slides: StorySlide[]
}

export function useStories(ageGroup?: AgeGroup) {
  return useQuery({
    queryKey: ['stories', ageGroup],
    queryFn: async () => {
      let query = supabase
        .from('stories')
        .select('id, category, age_group, title, description, thumbnail_url, is_premium')
        .eq('status', 'published')
        .order('display_order')

      if (ageGroup) query = query.eq('age_group', ageGroup)

      const { data, error } = await query
      if (error) throw error
      return data as StoryListItem[]
    },
    staleTime: 24 * 60 * 60 * 1000, // 24-hour cache (ADR 013)
    gcTime: 48 * 60 * 60 * 1000,
  })
}

export function useStory(storyId: string) {
  return useQuery({
    queryKey: ['story', storyId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stories')
        .select('*, story_slides(*)')
        .eq('id', storyId)
        .eq('status', 'published')
        .order('slide_index', { referencedTable: 'story_slides' })
        .single()

      if (error) throw error
      return data as StoryDetail
    },
    staleTime: 24 * 60 * 60 * 1000,
  })
}
