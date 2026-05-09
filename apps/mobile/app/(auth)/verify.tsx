import { useState } from 'react'
import { View, Text, TextInput, Pressable, StyleSheet } from 'react-native'
import { router, useLocalSearchParams } from 'expo-router'
import { supabase } from '@/lib/supabase'

export default function VerifyScreen() {
  const { phone } = useLocalSearchParams<{ phone: string }>()
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function verify() {
    setLoading(true)
    setError('')

    const { error: err } = await supabase.auth.verifyOtp({
      phone: phone.startsWith('+') ? phone : `+91${phone}`,
      token: otp,
      type: 'sms',
    })

    setLoading(false)
    if (err) { setError(err.message); return }
    // Root layout detects session change and redirects to (app)
  }

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.back}>
        <Text style={styles.backText}>← Back</Text>
      </Pressable>

      <Text style={styles.title}>Enter OTP</Text>
      <Text style={styles.subtitle}>Sent to {phone}</Text>

      <TextInput
        style={styles.input}
        placeholder="• • • • • •"
        placeholderTextColor="#bbb"
        keyboardType="number-pad"
        value={otp}
        onChangeText={setOtp}
        maxLength={6}
        autoFocus
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Pressable
        onPress={verify}
        disabled={otp.length < 6 || loading}
        style={({ pressed }) => [styles.btn, (otp.length < 6 || loading) && styles.btnDisabled, pressed && styles.pressed]}
      >
        <Text style={styles.btnText}>{loading ? 'Verifying…' : 'Verify'}</Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 32, justifyContent: 'center' },
  back: { position: 'absolute', top: 56, left: 24 },
  backText: { color: '#FF6B00', fontSize: 16 },
  title: { fontSize: 28, fontWeight: '700', color: '#1a1a1a', marginBottom: 6 },
  subtitle: { fontSize: 15, color: '#777', marginBottom: 32 },
  input: {
    borderWidth: 1.5, borderColor: '#e0e0e0', borderRadius: 14,
    padding: 16, fontSize: 32, textAlign: 'center', letterSpacing: 8, color: '#1a1a1a',
    marginBottom: 12,
  },
  btn: { backgroundColor: '#FF6B00', borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 4 },
  btnDisabled: { opacity: 0.45 },
  pressed: { opacity: 0.85 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  error: { color: '#e53e3e', fontSize: 13, marginBottom: 8, textAlign: 'center' },
})
