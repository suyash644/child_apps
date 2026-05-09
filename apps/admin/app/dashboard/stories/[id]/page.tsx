import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import StoryForm from '@/components/StoryForm'
import GenerateAudioButton from '@/components/GenerateAudioButton'

export default async function EditStoryPage({ params }: { params: { id: string } }) {
  const supabase = createClient()

  const { data: story } = await supabase
    .from('stories')
    .select('*, story_slides(*)')
    .eq('id', params.id)
    .single()

  if (!story) notFound()

  return (
    <div>
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {(story.title as Record<string, string>).hi ?? 'Untitled Story'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {story.story_slides?.length ?? 0} slides
          </p>
        </div>

        {/* Audio generation — only enabled for published stories (ADR 005, 010) */}
        {story.status === 'published' && (
          <GenerateAudioButton storyId={story.id} />
        )}
      </div>

      <StoryForm story={story} />
    </div>
  )
}
