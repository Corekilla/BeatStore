'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'

const supabase = createClient()

export default function EnrollPage() {
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [factorId, setFactorId] = useState<string | null>(null)
  const [token, setToken] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [enrolled, setEnrolled] = useState(false)

  useEffect(() => {
    const startEnrollment = async () => {
      // Check if already enrolled
      const { data: factors } = await supabase.auth.mfa.listFactors()
      if (factors?.totp && factors.totp.length > 0) {
        setEnrolled(true)
        return
      }

      // Start TOTP enrollment
      const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
        issuer: 'BeatStore Admin',
        friendlyName: 'Authenticator App',
      })

      if (error) {
        setError(error.message)
        return
      }

      setQrCode(data.totp.qr_code)
      setFactorId(data.id)
    }

    startEnrollment()
  }, [])

  const handleVerify = async () => {
    if (!factorId) return
    setLoading(true)
    setError('')

    const { data: challengeData, error: challengeError } =
      await supabase.auth.mfa.challenge({ factorId })

    if (challengeError) {
      setError(challengeError.message)
      setLoading(false)
      return
    }

    const { error: verifyError } = await supabase.auth.mfa.verify({
      factorId,
      challengeId: challengeData.id,
      code: token,
    })

    if (verifyError) {
      setError(verifyError.message)
      setLoading(false)
      return
    }

    // Enrollment complete
    window.location.href = '/admin'
  }

  if (enrolled) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-full max-w-sm p-8 bg-surface border border-border rounded-lg text-center">
          <p className="text-text mb-4">MFA is already enrolled on this account.</p>
          <a href="/admin" className="btn-primary px-6 py-2 text-sm">
            Go to Admin
          </a>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-sm p-8 bg-surface border border-border rounded-lg">
        <h1 className="font-display text-3xl text-accent mb-2">Set Up 2FA</h1>
        <p className="text-muted text-sm mb-6">
          Scan this QR code with Google Authenticator or Authy, then enter the 6-digit code to confirm.
        </p>

        {qrCode && (
          <div className="flex justify-center mb-6">
            <img src={qrCode} alt="MFA QR Code" className="w-48 h-48 rounded" />
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm text-muted mb-1">Verification Code</label>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="w-full bg-surface-2 border border-border rounded px-3 py-2 text-sm text-text focus:outline-none focus:border-accent font-mono tracking-widest text-center"
              placeholder="000000"
              maxLength={6}
              onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button
            onClick={handleVerify}
            disabled={loading || token.length !== 6}
            className="w-full btn-primary py-2.5 text-sm"
          >
            {loading ? 'Verifying...' : 'Confirm & Enable 2FA'}
          </button>
        </div>
      </div>
    </main>
  )
}