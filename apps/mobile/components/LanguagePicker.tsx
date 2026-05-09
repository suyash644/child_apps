import { View, Text, Pressable, StyleSheet } from 'react-native'
import { useStore } from '@/lib/store'
import { ACTIVE_LANGUAGES, LANGUAGE_LABELS, type LanguageCode } from '@/lib/i18n'

export default function LanguagePicker() {
  const lang = useStore((s) => s.lang)
  const setLang = useStore((s) => s.setLang)

  return (
    <View style={styles.row}>
      {ACTIVE_LANGUAGES.map((code) => (
        <Pressable
          key={code}
          onPress={() => setLang(code as LanguageCode)}
          style={[styles.pill, lang === code && styles.pillActive]}
        >
          <Text style={[styles.label, lang === code && styles.labelActive]}>
            {LANGUAGE_LABELS[code as LanguageCode]}
          </Text>
        </Pressable>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 8 },
  pill: {
    paddingHorizontal: 14, paddingVertical: 6,
    borderRadius: 20, borderWidth: 1, borderColor: '#e0e0e0',
    backgroundColor: '#fff',
  },
  pillActive: { backgroundColor: '#FF6B00', borderColor: '#FF6B00' },
  label: { fontSize: 13, color: '#555' },
  labelActive: { color: '#fff', fontWeight: '600' },
})
