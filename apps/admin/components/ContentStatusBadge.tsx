import type { ContentStatus } from '@/lib/supabase/types'

const STYLES: Record<ContentStatus, string> = {
  published: 'bg-green-100 text-green-700',
  review:    'bg-yellow-100 text-yellow-700',
  draft:     'bg-gray-100 text-gray-600',
}

const LABELS: Record<ContentStatus, string> = {
  published: 'Published',
  review:    'In Review',
  draft:     'Draft',
}

export default function ContentStatusBadge({ status }: { status: ContentStatus }) {
  return (
    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${STYLES[status]}`}>
      {LABELS[status]}
    </span>
  )
}
