// Global app state (Zustand)
// Kept minimal: only state that needs to survive component unmounts.
// Server state (stories, progress) lives in React Query, not here.

import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'
import type { LanguageCode } from './i18n'

interface Child {
  id: string
  name: string
  age_group: 'tiny_devotee' | 'young_scholar' | 'dharma_scholar'
  avatar_id: string
  total_xp: number
}

interface AppState {
  // Currently selected child profile (a parent may have multiple children)
  activeChild: Child | null
  setActiveChild: (child: Child | null) => void

  // Selected language for content display and audio
  lang: LanguageCode
  setLang: (lang: LanguageCode) => void

  // Last played story per child (for resume)
  lastStory: Record<string, { storyId: string; slideIndex: number }>
  setLastStory: (childId: string, storyId: string, slideIndex: number) => void
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      activeChild: null,
      setActiveChild: (child) => set({ activeChild: child }),

      lang: 'hi',
      setLang: (lang) => set({ lang }),

      lastStory: {},
      setLastStory: (childId, storyId, slideIndex) =>
        set((state) => ({
          lastStory: { ...state.lastStory, [childId]: { storyId, slideIndex } },
        })),
    }),
    {
      name: 'dharma-seekho-store',
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
)
