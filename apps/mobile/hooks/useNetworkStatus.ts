import { useState, useEffect } from 'react'
import * as Network from 'expo-network'

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    let mounted = true

    async function check() {
      const state = await Network.getNetworkStateAsync()
      if (mounted) setIsOnline(state.isInternetReachable ?? true)
    }

    check()

    // Re-check every 5 seconds
    const interval = setInterval(check, 5000)
    return () => {
      mounted = false
      clearInterval(interval)
    }
  }, [])

  return isOnline
}
