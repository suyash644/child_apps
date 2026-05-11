import PocketBase from 'pocketbase'
import { cookies } from 'next/headers'

export function createClient(): PocketBase {
  const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL ?? 'http://127.0.0.1:8090')
  const cookieStore = cookies()
  const rawCookie = cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join('; ')
  pb.authStore.loadFromCookie(rawCookie)
  return pb
}
