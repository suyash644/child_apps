import { useEffect, useState } from 'react'
import { View, Text, Pressable, StyleSheet, ScrollView, ActivityIndicator } from 'react-native'
import { pb } from '@/lib/pb'
import { useStore } from '@/lib/store'
import { router } from 'expo-router'

interface Subscription {
  plan: string
  status: string
  expires_at: string | null
}

export default function ProfileScreen() {
  const activeChild = useStore((s) => s.activeChild)
  const setActiveChild = useStore((s) => s.setActiveChild)
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userId = pb.authStore.model?.id
    if (!userId) { setLoading(false); return }

    pb.collection('subscriptions')
      .getFirstListItem<Subscription>(`user = "${userId}" && status = "active"`)
      .then((data) => { setSubscription(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  async function signOut() {
    setActiveChild(null)
    pb.authStore.clear()
    router.replace('/(auth)/login')
  }

  const isPremium = subscription && subscription.plan !== 'free' && subscription.status === 'active'

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.heading}>Profile</Text>

      {activeChild && (
        <View style={styles.card}>
          <Text style={styles.avatar}>
            {activeChild.avatar_id === 'default' ? '🧒' : activeChild.avatar_id}
          </Text>
          <Text style={styles.childName}>{activeChild.name}</Text>
          <Text style={styles.xp}>⭐ {activeChild.total_xp} XP total</Text>
        </View>
      )}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Subscription</Text>
        {loading ? (
          <ActivityIndicator color="#FF6B00" />
        ) : isPremium ? (
          <View style={styles.premiumBadge}>
            <Text style={styles.premiumText}>✦ Premium Active</Text>
            {subscription?.expires_at && (
              <Text style={styles.expiryText}>
                Renews {new Date(subscription.expires_at).toLocaleDateString('en-IN')}
              </Text>
            )}
          </View>
        ) : (
          <View>
            <Text style={styles.freePlan}>Free plan</Text>
            <Text style={styles.upgradeHint}>Upgrade to unlock all stories and languages</Text>
            <Pressable style={styles.upgradeBtn}>
              <Text style={styles.upgradeBtnText}>Upgrade — ₹99/month</Text>
            </Pressable>
          </View>
        )}
      </View>

      <Pressable onPress={signOut} style={styles.signOutBtn}>
        <Text style={styles.signOutText}>Sign Out</Text>
      </Pressable>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#FAFAF8' },
  content: { padding: 20, paddingTop: 60, paddingBottom: 40 },
  heading: { fontSize: 26, fontWeight: '700', color: '#1a1a1a', marginBottom: 20 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 20, borderWidth: 1, borderColor: '#f0f0f0' },
  avatar: { fontSize: 52, marginBottom: 8 },
  childName: { fontSize: 20, fontWeight: '700', color: '#1a1a1a' },
  xp: { color: '#FF6B00', marginTop: 4, fontWeight: '600' },
  section: { backgroundColor: '#fff', borderRadius: 16, padding: 18, marginBottom: 16, borderWidth: 1, borderColor: '#f0f0f0' },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: '#1a1a1a', marginBottom: 12 },
  premiumBadge: { backgroundColor: '#FFF8E7', borderRadius: 10, padding: 12 },
  premiumText: { fontSize: 16, fontWeight: '700', color: '#F5A623' },
  expiryText: { fontSize: 12, color: '#aaa', marginTop: 4 },
  freePlan: { fontSize: 15, color: '#555', marginBottom: 6 },
  upgradeHint: { fontSize: 13, color: '#aaa', marginBottom: 12 },
  upgradeBtn: { backgroundColor: '#FF6B00', borderRadius: 10, padding: 14, alignItems: 'center' },
  upgradeBtnText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  signOutBtn: { marginTop: 8, padding: 16, alignItems: 'center' },
  signOutText: { color: '#aaa', fontSize: 14 },
})
