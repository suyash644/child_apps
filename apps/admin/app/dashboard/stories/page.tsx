import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import ContentStatusBadge from '@/components/ContentStatusBadge'
import type { ContentStatus } from '@/lib/supabase/types'

export default async function StoriesPage({
  searchParams,
}: {
  searchParams: { status?: string }
}) {
  const supabase = createClient()
  const statusFilter = searchParams.status as ContentStatus | undefined

  let query = supabase
    .from('stories')
    .select('id, title, category, age_group, is_premium, status, display_order, updated_at')
    .order('display_order', { ascending: true })

  if (statusFilter) query = query.eq('status', statusFilter)

  const { data: stories } = await query

  const STATUS_TABS: { label: string; value: string | undefined }[] = [
    { label: 'All', value: undefined },
    { label: 'Published', value: 'published' },
    { label: 'In Review', value: 'review' },
    { label: 'Draft', value: 'draft' },
  ]

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Stories</h1>
        <Link
          href="/dashboard/stories/new"
          className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + New Story
        </Link>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 mb-4">
        {STATUS_TABS.map((tab) => {
          const active = statusFilter === tab.value
          const href = tab.value ? `/dashboard/stories?status=${tab.value}` : '/dashboard/stories'
          return (
            <Link
              key={tab.label}
              href={href}
              className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${
                active
                  ? 'bg-gray-900 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              {tab.label}
            </Link>
          )
        })}
      </div>

      {/* Stories table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {stories?.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-12">
            No stories found.{' '}
            <Link href="/dashboard/stories/new" className="text-orange-500 underline">
              Create one
            </Link>
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Title (Hindi)</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Category</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Age Group</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Status</th>
                <th className="text-left px-4 py-3 text-gray-500 font-medium">Updated</th>
                <th />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {stories?.map((story) => (
                <tr key={story.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">
                    {(story.title as Record<string, string>).hi ?? '—'}
                    {story.is_premium && (
                      <span className="ml-2 text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">
                        Premium
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-600 capitalize">
                    {story.category.replace('_', ' ')}
                  </td>
                  <td className="px-4 py-3 text-gray-600 capitalize">
                    {story.age_group.replace('_', ' ')}
                  </td>
                  <td className="px-4 py-3">
                    <ContentStatusBadge status={story.status as ContentStatus} />
                  </td>
                  <td className="px-4 py-3 text-gray-400">
                    {new Date(story.updated_at).toLocaleDateString('en-IN')}
                  </td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/dashboard/stories/${story.id}`}
                      className="text-orange-500 hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
