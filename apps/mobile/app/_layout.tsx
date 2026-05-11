import { useEffect, useState } from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { pb, loadStoredAuth } from '@/lib/pb'

const queryClient = new QueryClient()

export default function RootLayout() {
  const [ready, setReady] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    loadStoredAuth().then(() => {
      setIsLoggedIn(pb.authStore.isValid)
      setReady(true)
    })

    const unsub = pb.authStore.onChange(() => {
      setIsLoggedIn(pb.authStore.isValid)
    })
    return () => unsub()
  }, [])

  if (!ready) return null

  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(auth)" redirect={isLoggedIn} />
        <Stack.Screen name="(app)"  redirect={!isLoggedIn} />
      </Stack>
    </QueryClientProvider>
  )
}
