import { ScrollView, View, Text, Pressable, StyleSheet, ActivityIndicator } from 'react-native'
import { useStore } from '@/lib/store'
import { useStories, type AgeGroup } from '@/hooks/useStories'
import { useNetworkStatus } from '@/hooks/useNetworkStatus'
import StoryCard from '@/components/StoryCard'
import LanguagePicker from '@/components/LanguagePicker'

const AGE_GROUPS: { value: AgeGroup; label: string; emoji: string }[] = [
  { value: 'tiny_devotee',   label: 'Tiny (3–6)',   emoji: '🌱' },
  { value: 'young_scholar',  label: 'Young (7–11)', emoji: '📚' },
  { value: 'dharma_scholar', label: 'Wise (11–15)', emoji: '🪔' },
]

export default function HomeScreen() {
  const isOnline = useNetworkStatus()
  const activeChild = useStore((s) => s.activeChild)
  const defaultAgeGroup = activeChild?.age_group ?? 'tiny_devotee'

  const { data: stories, isLoading, isError } = useStories(defaultAgeGroup)

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* Offline banner (ADR 013) */}
      {!isOnline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>Offline — showing cached content</Text>
        </View>
      )}

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>
            {activeChild ? `Jai Shri Ram, ${activeChild.name}!` : 'Jai Shri Ram! 🙏'}
          </Text>
          {activeChild && (
            <Text style={styles.xp}>⭐ {activeChild.total_xp} XP</Text>
          )}
        </View>
        <LanguagePicker />
      </View>

      {/* Age group filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
        {AGE_GROUPS.map((g) => {
          const active = g.value === defaultAgeGroup
          return (
            <Pressable key={g.value} style={[styles.filterPill, active && styles.filterPillActive]}>
              <Text style={[styles.filterText, active && styles.filterTextActive]}>
                {g.emoji} {g.label}
              </Text>
            </Pressable>
          )
        })}
      </ScrollView>

      {/* Stories */}
      <Text style={styles.sectionTitle}>Stories</Text>

      {isLoading ? (
        <ActivityIndicator color="#FF6B00" style={{ marginTop: 32 }} />
      ) : isError ? (
        <Text style={styles.errorText}>Could not load stories. Check your connection.</Text>
      ) : (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storyRow}>
          {stories?.map((s) => <StoryCard key={s.id} story={s} />)}
        </ScrollView>
      )}

      {/* XP summary card */}
      {activeChild && (
        <View style={styles.xpCard}>
          <Text style={styles.xpCardTitle}>Today's Progress</Text>
          <View style={styles.xpBar}>
            <View style={[styles.xpFill, { width: `${Math.min((activeChild.total_xp % 100), 100)}%` }]} />
          </View>
          <Text style={styles.xpHint}>{100 - (activeChild.total_xp % 100)} XP to next level</Text>
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FAFAF8' },
  content: { paddingBottom: 32 },
  offlineBanner: { backgroundColor: '#FFF3CD', padding: 10, alignItems: 'center' },
  offlineText: { fontSize: 12, color: '#856404' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start',
    paddingHorizontal: 20, paddingTop: 60, paddingBottom: 16,
  },
  greeting: { fontSize: 20, fontWeight: '700', color: '#1a1a1a' },
  xp: { fontSize: 13, color: '#FF6B00', marginTop: 2 },
  filterRow: { paddingLeft: 20, marginBottom: 8 },
  filterPill: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#e8e8e8', marginRight: 8,
  },
  filterPillActive: { backgroundColor: '#FF6B00', borderColor: '#FF6B00' },
  filterText: { fontSize: 13, color: '#666' },
  filterTextActive: { color: '#fff', fontWeight: '600' },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1a1a1a', paddingHorizontal: 20, marginBottom: 12 },
  storyRow: { paddingLeft: 20 },
  errorText: { color: '#e53e3e', textAlign: 'center', marginTop: 32, paddingHorizontal: 20 },
  xpCard: {
    margin: 20, marginTop: 28, backgroundColor: '#fff',
    borderRadius: 16, padding: 18, borderWidth: 1, borderColor: '#f0f0f0',
  },
  xpCardTitle: { fontSize: 14, fontWeight: '600', color: '#1a1a1a', marginBottom: 10 },
  xpBar: { height: 8, backgroundColor: '#f0f0f0', borderRadius: 4, overflow: 'hidden' },
  xpFill: { height: '100%', backgroundColor: '#FF6B00', borderRadius: 4 },
  xpHint: { fontSize: 12, color: '#aaa', marginTop: 6 },
})
