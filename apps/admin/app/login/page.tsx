'use client'

import { useState } from 'react'
import { createClient } from '@/lib/pb/client'
import { useRouter, useSearchParams } from 'next/navigation'

export default function LoginPage() {
  const pb = createClient()
  const router = useRouter()
  const params = useSearchParams()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function login() {
    setLoading(true)
    setError('')
    try {
      await pb.collection('users').authWithPassword(email, password)
      router.push('/dashboard')
      router.refresh()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Invalid email or password')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-1">Dharma Seekho</h1>
        <p className="text-sm text-gray-500 mb-6">Admin Panel</p>

        {params.get('error') === 'unauthorized' && (
          <p className="text-sm text-red-600 mb-4 bg-red-50 rounded-lg p-3">
            Your account does not have admin access.
          </p>
        )}

        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          placeholder="admin@dharmaseeho.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />

        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && login()}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
        />

        <button
          onClick={login}
          disabled={loading || !email || !password}
          className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-medium py-2 rounded-lg text-sm transition-colors"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>

        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
      </div>
    </div>
  )
}
