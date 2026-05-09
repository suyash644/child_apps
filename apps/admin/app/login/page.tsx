'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()
  const params = useSearchParams()

  const [phone, setPhone] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'phone' | 'otp'>('phone')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function sendOtp() {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithOtp({ phone })
    if (error) setError(error.message)
    else setStep('otp')
    setLoading(false)
  }

  async function verifyOtp() {
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.verifyOtp({ phone, token: otp, type: 'sms' })
    if (error) setError(error.message)
    else router.push('/dashboard')
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

        {step === 'phone' ? (
          <>
            <label className="block text-sm font-medium mb-1">Phone number</label>
            <input
              type="tel"
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={sendOtp}
              disabled={loading || !phone}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-medium py-2 rounded-lg text-sm transition-colors"
            >
              {loading ? 'Sending…' : 'Send OTP'}
            </button>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-4">OTP sent to {phone}</p>
            <label className="block text-sm font-medium mb-1">Enter OTP</label>
            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
            />
            <button
              onClick={verifyOtp}
              disabled={loading || otp.length < 6}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-medium py-2 rounded-lg text-sm transition-colors"
            >
              {loading ? 'Verifying…' : 'Verify & Sign in'}
            </button>
            <button
              onClick={() => { setStep('phone'); setOtp('') }}
              className="w-full mt-2 text-sm text-gray-500 hover:text-gray-700"
            >
              Change number
            </button>
          </>
        )}

        {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
      </div>
    </div>
  )
}
