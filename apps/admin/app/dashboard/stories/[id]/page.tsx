import { createClient } from '@/lib/pb/server'
import { notFound } from 'next/navigation'
import StoryForm from '@/components/StoryForm'
import GenerateAudioButton from '@/components/GenerateAudioButton'

export default async function EditStoryPage({ params }: { params: { id: string } }) {
  const pb = createClient()

  let story
  try {
    story = await pb.collection('stories').getOne(params.id, {
      expand: 'story_slides(story)',
    })
  } catch {
    notFound()
  }

  const slides = (story.expand as Record<string, unknown[]> | undefined)?.['story_slides(story)'] ?? []

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {(story.title as Record<string, string>).hi ?? 'Untitled Story'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">{slides.length} slides</p>
        </div>

        {story.status === 'published' && (
          <GenerateAudioButton storyId={story.id} />
        )}
      </div>

      <StoryForm story={story as never} />
    </div>
  )
}
