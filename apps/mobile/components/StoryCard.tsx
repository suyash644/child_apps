import { Pressable, View, Text, Image, StyleSheet } from 'react-native'
import { router } from 'expo-router'
import { getText } from '@/lib/i18n'
import { useStore } from '@/lib/store'
import type { StoryListItem } from '@/hooks/useStories'

interface Props {
  story: StoryListItem
}

const CATEGORY_COLORS: Record<string, string> = {
  ramayana: '#E8472A',
  mahabharata: '#7B3F9E',
  ganesha: '#F5A623',
  krishna: '#1A6BB5',
  hanuman: '#E85D26',
  shiva: '#5B8CBF',
  festivals: '#E8472A',
  dharma_values: '#3AAA6E',
}

export default function StoryCard({ story }: Props) {
  const lang = useStore((s) => s.lang)
  const title = getText(story.title, lang)
  const accent = CATEGORY_COLORS[story.category] ?? '#FF6B00'

  return (
    <Pressable
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
      onPress={() => router.push(`/story/${story.id}`)}
    >
      {/* Thumbnail */}
      <View style={[styles.thumb, { backgroundColor: accent + '22' }]}>
        {story.thumbnail_url ? (
          <Image source={{ uri: story.thumbnail_url }} style={styles.thumbImage} />
        ) : (
          <View style={[styles.thumbPlaceholder, { backgroundColor: accent + '33' }]} />
        )}
        {story.is_premium && (
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>✦</Text>
          </View>
        )}
      </View>

      {/* Title */}
      <Text style={styles.title} numberOfLines={2}>{title}</Text>

      {/* Category dot */}
      <View style={styles.meta}>
        <View style={[styles.dot, { backgroundColor: accent }]} />
        <Text style={styles.category}>{story.category.replace('_', ' ')}</Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card: {
    width: 160,
    marginRight: 12,
    borderRadius: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    overflow: 'hidden',
  },
  pressed: { opacity: 0.9, transform: [{ scale: 0.98 }] },
  thumb: { width: '100%', height: 110 },
  thumbImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  thumbPlaceholder: { flex: 1 },
  premiumBadge: {
    position: 'absolute', top: 8, right: 8,
    backgroundColor: '#F5A623', borderRadius: 10,
    width: 20, height: 20, alignItems: 'center', justifyContent: 'center',
  },
  premiumText: { fontSize: 10, color: '#fff' },
  title: { fontSize: 13, fontWeight: '600', color: '#1a1a1a', padding: 10, paddingBottom: 4 },
  meta: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, paddingBottom: 10 },
  dot: { width: 6, height: 6, borderRadius: 3, marginRight: 5 },
  category: { fontSize: 11, color: '#888', textTransform: 'capitalize' },
})
