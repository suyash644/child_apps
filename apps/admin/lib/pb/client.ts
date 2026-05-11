import PocketBase from 'pocketbase'

let _pb: PocketBase | null = null

export function createClient(): PocketBase {
  if (!_pb) {
    _pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL ?? 'http://127.0.0.1:8090')
    // Sync auth state to cookie so server components can read it
    _pb.authStore.onChange(() => {
      if (typeof document !== 'undefined') {
        document.cookie = _pb!.authStore.exportToCookie({ httpOnly: false, sameSite: 'Lax' })
      }
    }, true)
  }
  return _pb
}
