import { useQuery } from '@tanstack/react-query'
import { pb } from '@/lib/pb'
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
      const filters = ['status = "published"']
      if (ageGroup) filters.push(`age_group = "${ageGroup}"`)

      const result = await pb.collection('stories').getList<StoryListItem>(1, 50, {
        filter: filters.join(' && '),
        sort: 'display_order',
        fields: 'id,category,age_group,title,description,thumbnail_url,is_premium',
      })
      return result.items
    },
    staleTime: 24 * 60 * 60 * 1000,
    gcTime: 48 * 60 * 60 * 1000,
  })
}

export function useStory(storyId: string) {
  return useQuery({
    queryKey: ['story', storyId],
    queryFn: async () => {
      const story = await pb.collection('stories').getOne(storyId, {
        filter: 'status = "published"',
        expand: 'story_slides(story)',
        sort: 'story_slides(story).slide_index',
      })
      const slides =
        (story.expand as Record<string, StorySlide[]> | undefined)?.['story_slides(story)'] ?? []
      return { ...story, story_slides: slides } as StoryDetail
    },
    staleTime: 24 * 60 * 60 * 1000,
  })
}
