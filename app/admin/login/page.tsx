'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase'

const supabase = createClient()

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [token, setToken] = useState('')
  const [step, setStep] = useState<'credentials' | 'mfa'>('credentials')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async () => {
  setLoading(true)
  setError('')

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    setError(error.message)
    setLoading(false)
    return
  }

  // Check MFA enrollment status
  const { data: factors } = await supabase.auth.mfa.listFactors()
  const isEnrolled = factors?.totp && factors.totp.length > 0

  if (!isEnrolled) {
    // First time — send to enrollment
    window.location.href = '/admin/enroll'
    return
  }

  // Already enrolled — prompt for MFA code
  setStep('mfa')
  setLoading(false)
}

  const handleMFA = async () => {
    setLoading(true)
    setError('')

    const factors = await supabase.auth.mfa.listFactors()
    const totpFactor = factors.data?.totp[0]

    if (!totpFactor) {
      setError('No MFA factor found')
      setLoading(false)
      return
    }

    const { data: challengeData, error: challengeError } =
      await supabase.auth.mfa.challenge({ factorId: totpFactor.id })

    if (challengeError) {
      setError(challengeError.message)
      setLoading(false)
      return
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId: totpFactor.id,
      challengeId: challengeData.id,
      code: token,
    })

    if (verifyError) {
      setError(verifyError.message)
      setLoading(false)
      return
    }

    router.push('/admin')
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm p-8 bg-surface border border-border rounded-lg">
        <h1 className="font-display text-3xl text-accent mb-2">Admin</h1>
        <p className="text-muted text-sm mb-8">Sign in</p>

        {step === 'credentials' ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-muted mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-2 border border-border rounded px-3 py-2 text-sm text-text focus:outline-none focus:border-accent"
                placeholder="E-mail"
              />
            </div>
            <div>
              <label className="block text-sm text-muted mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface-2 border border-border rounded px-3 py-2 text-sm text-text focus:outline-none focus:border-accent"
                placeholder="••••••••"
                onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
              />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full btn-primary py-2.5 text-sm"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-sm text-text">
              Enter the 6-digit code from your authenticator app
            </p>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full bg-surface-2 border border-border rounded px-3 py-2 text-sm text-text focus:outline-none focus:border-accent font-mono tracking-widest text-center"
              placeholder="000000"
              maxLength={6}
              onKeyDown={(e) => e.key === 'Enter' && handleMFA()}
            />
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button
              onClick={handleMFA}
              disabled={loading}
              className="w-full btn-primary py-2.5 text-sm"
            >
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </div>
        )}
      </div>
    </main>
  )
}