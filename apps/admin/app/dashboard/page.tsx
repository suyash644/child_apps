import { createClient } from '@/lib/pb/server'

export default async function DashboardPage() {
  const pb = createClient()

  const [total, published, draft, review] = await Promise.all([
    pb.collection('stories').getList(1, 1, { fields: 'id' }),
    pb.collection('stories').getList(1, 1, { filter: 'status = "published"', fields: 'id' }),
    pb.collection('stories').getList(1, 1, { filter: 'status = "draft"', fields: 'id' }),
    pb.collection('stories').getList(1, 1, { filter: 'status = "review"', fields: 'id' }),
  ])

  const stats = [
    { label: 'Total Stories',  value: total.totalItems,     color: 'bg-blue-50 text-blue-700' },
    { label: 'Published',      value: published.totalItems, color: 'bg-green-50 text-green-700' },
    { label: 'In Review',      value: review.totalItems,    color: 'bg-yellow-50 text-yellow-700' },
    { label: 'Drafts',         value: draft.totalItems,     color: 'bg-gray-50 text-gray-700' },
  ]

  const reviewCount = review.totalItems

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

      {reviewCount > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 text-sm text-yellow-800">
          {reviewCount} {reviewCount === 1 ? 'story is' : 'stories are'} waiting for review and publish.{' '}
          <a href="/dashboard/stories?status=review" className="underline font-medium">Review now</a>
        </div>
      )}
    </div>
  )
}
