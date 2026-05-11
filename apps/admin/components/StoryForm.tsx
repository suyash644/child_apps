'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/pb/client'
import MultilingualEditor from './MultilingualEditor'
import ContentStatusBadge from './ContentStatusBadge'
import type { Story, MultilingualText, AgeGroup, StoryCategory, ContentStatus } from '@/lib/types'

interface Props {
  story?: Story & { story_slides?: unknown[] }
}

const AGE_GROUPS: { value: AgeGroup; label: string }[] = [
  { value: 'tiny_devotee',   label: 'Tiny Devotees (3–6)' },
  { value: 'young_scholar',  label: 'Young Scholars (7–11)' },
  { value: 'dharma_scholar', label: 'Dharma Scholars (11–15)' },
]

const CATEGORIES: { value: StoryCategory; label: string }[] = [
  { value: 'ramayana',      label: 'Ramayana' },
  { value: 'mahabharata',   label: 'Mahabharata' },
  { value: 'ganesha',       label: 'Ganesha' },
  { value: 'krishna',       label: 'Krishna' },
  { value: 'hanuman',       label: 'Hanuman' },
  { value: 'shiva',         label: 'Shiva' },
  { value: 'festivals',     label: 'Festivals' },
  { value: 'dharma_values', label: 'Dharma Values' },
]

export default function StoryForm({ story }: Props) {
  const isEditing = Boolean(story)
  const router = useRouter()
  const pb = createClient()
  const [isPending, startTransition] = useTransition()

  const [title, setTitle]         = useState<MultilingualText>(story?.title ?? {})
  const [description, setDesc]    = useState<MultilingualText>(story?.description ?? {})
  const [category, setCategory]   = useState<StoryCategory>(story?.category ?? 'ganesha')
  const [ageGroup, setAgeGroup]   = useState<AgeGroup>(story?.age_group ?? 'tiny_devotee')
  const [isPremium, setIsPremium] = useState(story?.is_premium ?? false)
  const [status, setStatus]       = useState<ContentStatus>(story?.status ?? 'draft')
  const [error, setError]         = useState('')

  async function save(nextStatus: ContentStatus) {
    setError('')
    startTransition(async () => {
      if (!title.hi) { setError('Hindi title is required.'); return }

      const payload = {
        title,
        description,
        category,
        age_group: ageGroup,
        is_premium: isPremium,
        status: nextStatus,
      }

      try {
        if (isEditing) {
          await pb.collection('stories').update(story!.id, payload)
        } else {
          await pb.collection('stories').create(payload)
        }
        setStatus(nextStatus)
        router.push('/dashboard/stories')
        router.refresh()
      } catch (e: unknown) {
        setError(e instanceof Error ? e.message : 'Failed to save story')
      }
    })
  }

  return (
    <div className="max-w-2xl space-y-6">
      {isEditing && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Current status:</span>
          <ContentStatusBadge status={status} />
          {status === 'review' && (
            <span className="text-xs text-yellow-600">
              Text was edited — audio may be out of sync
            </span>
          )}
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as StoryCategory)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            {CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>{c.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Age Group</label>
          <select
            value={ageGroup}
            onChange={(e) => setAgeGroup(e.target.value as AgeGroup)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          >
            {AGE_GROUPS.map((a) => (
              <option key={a.value} value={a.value}>{a.label}</option>
            ))}
          </select>
        </div>
      </div>

      <MultilingualEditor label="Title" value={title} onChange={setTitle} />
      <MultilingualEditor label="Description" value={description} onChange={setDesc} multiline />

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={isPremium}
          onChange={(e) => setIsPremium(e.target.checked)}
          className="w-4 h-4 accent-orange-500"
        />
        <span className="text-sm font-medium text-gray-700">Premium content</span>
        <span className="text-xs text-gray-400">(requires active subscription)</span>
      </label>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-2">{error}</p>
      )}

      <div className="flex gap-3 pt-2">
        <button
          onClick={() => save('draft')}
          disabled={isPending}
          className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition-colors"
        >
          Save as Draft
        </button>
        <button
          onClick={() => save('review')}
          disabled={isPending}
          className="px-4 py-2 text-sm bg-yellow-50 text-yellow-700 border border-yellow-200 rounded-lg hover:bg-yellow-100 disabled:opacity-50 transition-colors"
        >
          Submit for Review
        </button>
        <button
          onClick={() => save('published')}
          disabled={isPending}
          className="px-4 py-2 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 disabled:opacity-50 transition-colors"
        >
          Publish
        </button>
      </div>
      <p className="text-xs text-gray-400">
        Only Super Admins can publish. Content Managers can submit for review.
      </p>
    </div>
  )
}
