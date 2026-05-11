import PocketBase from 'pocketbase'
import AsyncStorage from '@react-native-async-storage/async-storage'

export const pb = new PocketBase(
  process.env.EXPO_PUBLIC_PB_URL ?? 'http://127.0.0.1:8090'
)

const STORAGE_KEY = 'pb_auth'

// Persist auth token across app restarts
pb.authStore.onChange(async () => {
  if (pb.authStore.isValid) {
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ token: pb.authStore.token, model: pb.authStore.model })
    )
  } else {
    await AsyncStorage.removeItem(STORAGE_KEY)
  }
})

export async function loadStoredAuth(): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY)
    if (raw) {
      const { token, model } = JSON.parse(raw)
      pb.authStore.save(token, model)
    }
  } catch {
    // ignore corrupt storage
  }
}
