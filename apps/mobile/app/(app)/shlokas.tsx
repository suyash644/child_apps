import { View, Text, StyleSheet } from 'react-native'

// Phase 1 placeholder — Shlokas screen built in Phase 2
export default function ShlokasScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.emoji}>📿</Text>
      <Text style={styles.title}>Shlokas</Text>
      <Text style={styles.sub}>Coming in Phase 2</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#FAFAF8' },
  emoji: { fontSize: 52, marginBottom: 12 },
  title: { fontSize: 22, fontWeight: '700', color: '#1a1a1a' },
  sub: { fontSize: 14, color: '#aaa', marginTop: 6 },
})
