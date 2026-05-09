import { useState } from 'react'
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { router } from 'expo-router'
import { supabase } from '@/lib/supabase'

export default function LoginScreen() {
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function sendOtp() {
    if (!phone.trim()) return
    setLoading(true)
    setError('')

    const { error: err } = await supabase.auth.signInWithOtp({
      phone: phone.startsWith('+') ? phone : `+91${phone}`,
    })

    setLoading(false)
    if (err) { setError(err.message); return }
    router.push({ pathname: '/(auth)/verify', params: { phone } })
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.inner}>
        <Text style={styles.logo}>🕉</Text>
        <Text style={styles.title}>Dharma Seekho</Text>
        <Text style={styles.subtitle}>Enter your mobile number to continue</Text>

        <TextInput
          style={styles.input}
          placeholder="98765 43210"
          placeholderTextColor="#bbb"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
          maxLength={13}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable
          onPress={sendOtp}
          disabled={loading || phone.length < 10}
          style={({ pressed }) => [styles.btn, (loading || phone.length < 10) && styles.btnDisabled, pressed && styles.pressed]}
        >
          <Text style={styles.btnText}>{loading ? 'Sending OTP…' : 'Send OTP'}</Text>
        </Pressable>

        <Text style={styles.hint}>We'll send a 6-digit code via SMS</Text>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  inner: { flex: 1, justifyContent: 'center', padding: 32 },
  logo: { fontSize: 52, textAlign: 'center', marginBottom: 12 },
  title: { fontSize: 28, fontWeight: '700', textAlign: 'center', color: '#1a1a1a', marginBottom: 6 },
  subtitle: { fontSize: 15, textAlign: 'center', color: '#777', marginBottom: 32 },
  input: {
    borderWidth: 1.5, borderColor: '#e0e0e0', borderRadius: 14,
    padding: 16, fontSize: 18, color: '#1a1a1a', letterSpacing: 1,
    marginBottom: 12,
  },
  btn: {
    backgroundColor: '#FF6B00', borderRadius: 14,
    padding: 16, alignItems: 'center', marginTop: 4,
  },
  btnDisabled: { opacity: 0.45 },
  pressed: { opacity: 0.85 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  error: { color: '#e53e3e', fontSize: 13, marginBottom: 8, textAlign: 'center' },
  hint: { color: '#aaa', fontSize: 12, textAlign: 'center', marginTop: 16 },
})
