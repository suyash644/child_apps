import { useState } from 'react'
import { View, Text, TextInput, Pressable, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native'
import { router } from 'expo-router'
import { pb } from '@/lib/pb'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function login() {
    if (!email.trim() || !password.trim()) return
    setLoading(true)
    setError('')

    try {
      await pb.collection('users').authWithPassword(email.trim(), password)
      // Root layout detects auth state change and redirects to (app)
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Invalid email or password')
    }
    setLoading(false)
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <View style={styles.inner}>
        <Text style={styles.logo}>🕉</Text>
        <Text style={styles.title}>Dharma Seekho</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#bbb"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#bbb"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          onSubmitEditing={login}
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <Pressable
          onPress={login}
          disabled={loading || !email || !password}
          style={({ pressed }) => [
            styles.btn,
            (loading || !email || !password) && styles.btnDisabled,
            pressed && styles.pressed,
          ]}
        >
          <Text style={styles.btnText}>{loading ? 'Signing in…' : 'Sign in'}</Text>
        </Pressable>
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
    padding: 16, fontSize: 16, color: '#1a1a1a', marginBottom: 12,
  },
  btn: {
    backgroundColor: '#FF6B00', borderRadius: 14,
    padding: 16, alignItems: 'center', marginTop: 4,
  },
  btnDisabled: { opacity: 0.45 },
  pressed: { opacity: 0.85 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  error: { color: '#e53e3e', fontSize: 13, marginBottom: 8, textAlign: 'center' },
})
