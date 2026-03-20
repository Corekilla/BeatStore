'use client'

import { useState } from 'react'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { useCart } from '@/lib/cart-store'
import { formatPrice } from '@/lib/utils'
import { LICENSE_DEFINITIONS } from '@/lib/licenses'
import type { LicenseType } from '@/types'

export default function CartPage() {
  const { items, removeItem, updateLicense, clearCart, total } = useCart()
  const hasVocalBeat = items.some(({ beat }) => beat.hasVocals)
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [marketingOptIn, setMarketingOptIn] = useState(true)

  const handleCheckout = async () => {
    if (!agreed) { setError('Please agree to the licensing terms.'); return }
    if (!email) { setError('Please enter your email.'); return }
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, email }),
      })
      const { url, error: err } = await res.json()
      if (err) { setError(err); return }
      window.location.href = url
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <>
        <Navbar />
        <div className="max-w-7xl mx-auto px-6 py-24 text-center">
          <h1 className="font-display text-4xl mb-4">Your Cart</h1>
          <p className="text-[var(--muted)] mb-8">No beats in your cart yet.</p>
          <a href="/" className="btn-primary inline-block">Browse Beats</a>
        </div>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="font-display text-4xl mb-10">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map(({ beat, license }) => (
              <div key={beat.id} className="card p-5 flex gap-4">
                {/* Cover */}
                <div className="w-20 h-20 bg-[var(--surface-2)] rounded-sm overflow-hidden flex-shrink-0">
                  {beat.coverArt && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={beat.coverArt} alt={beat.title} className="w-full h-full object-cover" />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-display text-lg">{beat.title}</h3>
                      <p className="text-xs text-[var(--muted)] font-mono">{beat.bpm} BPM · {beat.key} · {beat.genre}</p>
                    </div>
                    <p className="text-accent font-mono font-medium">{formatPrice(license.price)}</p>
                  </div>

                  {/* License changer */}
                  <div className="flex gap-1 mt-3 flex-wrap">
                    {(Object.keys(LICENSE_DEFINITIONS) as LicenseType[]).map((type) => {
                      const l = LICENSE_DEFINITIONS[type]
                      return (
                        <button
                          key={type}
                          onClick={() => updateLicense(beat.id, { ...l, type })}
                          className={`text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-sm border transition-all ${
                            license.type === type
                              ? 'border-accent text-accent'
                              : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--muted)]'
                          }`}
                        >
                          {l.label}
                        </button>
                      )
                    })}
                  </div>

                  {/* License features */}
                  <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1">
                    {license.features.slice(0, 3).map((f) => (
                      <li key={f} className="text-[11px] text-[var(--muted)]">✓ {f}</li>
                    ))}
                  </ul>
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(beat.id)}
                  className="text-[var(--muted)] hover:text-red-400 transition-colors self-start mt-1"
                  aria-label="Remove"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="card p-6 h-fit sticky top-24">
            <h2 className="font-display text-2xl mb-6">Summary</h2>

            <div className="space-y-2 mb-6 text-sm">
              {items.map(({ beat, license }) => (
                <div key={beat.id} className="flex justify-between text-[var(--muted)]">
                  <span className="truncate mr-4">{beat.title}</span>
                  <span className="font-mono flex-shrink-0">{formatPrice(license.price)}</span>
                </div>
              ))}
              <div className="border-t border-[var(--border)] pt-3 flex justify-between font-medium text-base">
                <span>Total</span>
                <span className="font-mono text-accent">{formatPrice(total())}</span>
              </div>
            </div>

            {/* Email */}
            <input
              type="email"
              placeholder="Your email for delivery"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[var(--surface-2)] border border-[var(--border)] rounded-sm px-4 py-2.5 text-sm
                         placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors mb-4"
            />

            {error && <p className="text-red-400 text-xs mb-3">{error}</p>}

            {/* Licensing agreement */}
            <div className="flex items-start gap-3 mb-4">
              <input
                type="checkbox"
                id="license-agree"
                checked={agreed}
                onChange={(e) => setAgreed(e.target.checked)}
                className="mt-0.5 accent-[var(--accent)] cursor-pointer"
              />
              <label htmlFor="license-agree" className="text-xs text-[var(--muted)] leading-relaxed cursor-pointer">
                I agree to the{' '}
                <a href="/licensing" target="_blank" className="text-accent underline hover:text-white transition-colors">
                  licensing terms
                </a>
                {' '}for each beat purchased. I understand these are non-refundable digital goods.{' '}
                View our{' '}
                <a href="/privacy-policy" target="_blank" className="text-accent underline hover:text-white transition-colors">
                  privacy policy
                </a>.
              </label>
            </div>

            {/* Marketing opt-in */}
            <div className="flex items-start gap-3 mb-4">
              <input
                type="checkbox"
                id="marketing-opt-in"
                checked={marketingOptIn}
                onChange={(e) => setMarketingOptIn(e.target.checked)}
                className="mt-0.5 accent-[var(--accent)] cursor-pointer"
              />
              <label htmlFor="marketing-opt-in" className="text-xs text-[var(--muted)] leading-relaxed cursor-pointer">
                Keep me updated with exclusive discounts, free downloads, and new beat drops.
                {hasVocalBeat && <span className="text-red-400"> Vocals not included.</span>}
              </label>
            </div>

            <button
            
              onClick={handleCheckout}
              disabled= {loading || !agreed}
              className="w-full btn-primary text-sm uppercase tracking-wider disabled:opacity-60"
            >
              {loading ? 'Redirecting...' : 'Checkout with Stripe'}
            </button>

            <button
              onClick={clearCart}
              className="w-full mt-3 text-xs text-[var(--muted)] hover:text-red-400 transition-colors"
            >
              Clear cart
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
