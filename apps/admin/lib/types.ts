export type LanguageCode = 'hi' | 'en' | 'gu' | 'mr' | 'ta' | 'te' | 'bn' | 'kn'
export type MultilingualText = Partial<Record<LanguageCode, string>>
export type AgeGroup = 'tiny_devotee' | 'young_scholar' | 'dharma_scholar'
export type ContentStatus = 'draft' | 'review' | 'published'
export type AdminRole = 'super_admin' | 'content_manager' | 'translator' | 'analytics_viewer'
export type StoryCategory =
  | 'ramayana' | 'mahabharata' | 'ganesha' | 'krishna'
  | 'hanuman' | 'shiva' | 'festivals' | 'dharma_values'

export interface Story {
  id: string
  title: MultilingualText
  description: MultilingualText
  category: StoryCategory
  age_group: AgeGroup
  status: ContentStatus
  is_premium: boolean
  display_order: number
  thumbnail_url: string | null
  updated: string
}

export interface StorySlide {
  id: string
  story: string
  slide_index: number
  content: MultilingualText
  image_url: string | null
  audio_urls: Partial<Record<LanguageCode, string>>
  word_timestamps: Record<string, Array<{ word: string; start_ms: number; end_ms: number }>>
}
