import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = createClient()

  const [
    { count: storiesCount },
    { count: publishedCount },
    { count: draftCount },
    { count: reviewCount },
  ] = await Promise.all([
    supabase.from('stories').select('*', { count: 'exact', head: true }),
    supabase.from('stories').select('*', { count: 'exact', head: true }).eq('status', 'published'),
    supabase.from('stories').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
    supabase.from('stories').select('*', { count: 'exact', head: true }).eq('status', 'review'),
  ])

  const stats = [
    { label: 'Total Stories', value: storiesCount ?? 0, color: 'bg-blue-50 text-blue-700' },
    { label: 'Published', value: publishedCount ?? 0, color: 'bg-green-50 text-green-700' },
    { label: 'In Review', value: reviewCount ?? 0, color: 'bg-yellow-50 text-yellow-700' },
    { label: 'Drafts', value: draftCount ?? 0, color: 'bg-gray-50 text-gray-700' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Overview</h1>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className={`rounded-xl p-5 ${s.color}`}>
            <p className="text-3xl font-bold">{s.value}</p>
            <p className="text-sm mt-1 opacity-80">{s.label}</p>
          </div>
        ))}
      </div>

      {(reviewCount ?? 0) > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
          {reviewCount} {reviewCount === 1 ? 'story is' : 'stories are'} waiting for review and publish.{' '}
          <a href="/dashboard/stories?status=review" className="underline font-medium">Review now</a>
        </div>
      )}
    </div>
  )
}
