'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Navbar } from '@/components/ui/Navbar'
import { Footer } from '@/components/ui/Footer'
import { useCart } from '@/lib/cart-store'

interface OrderItem {
  beatTitle: string
  licenseType: string
  downloadUrl?: string
}

function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const clearCart = useCart((s) => s.clearCart)
  const [order, setOrder] = useState<{ items: OrderItem[]; email: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    clearCart()
    if (!sessionId) { setLoading(false); return }

    let attempts = 0
    const poll = async () => {
      const res = await fetch(`/api/orders?session_id=${sessionId}`)
      const data = await res.json()
      if (data.order?.status === 'paid' || attempts >= 10) {
        setOrder(data.order)
        setLoading(false)
      } else {
        attempts++
        setTimeout(poll, 2000)
      }
    }
    poll()
  }, [sessionId, clearCart])

  return (
    <div className="max-w-2xl mx-auto px-6 py-24 text-center">
      {loading ? (
        <>
          <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <p className="text-[var(--muted)]">Confirming your order…</p>
        </>
      ) : (
        <>
          <div className="w-16 h-16 rounded-full bg-accent/10 border border-accent flex items-center justify-center mx-auto mb-6">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2">
              <polyline points="20,6 9,17 4,12"/>
            </svg>
          </div>
          <h1 className="font-display text-4xl mb-3">You're good to go.</h1>
          <p className="text-[var(--muted)] mb-10">
            Download links have been sent to <strong className="text-text">{order?.email}</strong>.
            They're also available below for the next 7 days.
          </p>
          <p className="text-xs text-[var(--accent)] mt-1 mb-1">
            Don't see the email? Check your spam folder and mark it as "not spam".
          </p>

          {order?.items && (
            <div className="card divide-y divide-[var(--border)] text-left mb-8">
              {order.items.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4">
                  <div>
                    <p className="font-medium">{item.beatTitle}</p>
                    <p className="text-xs text-[var(--muted)] font-mono mt-0.5 capitalize">
                      {item.licenseType.replace('_', ' ')}
                    </p>
                  </div>
                  {item.downloadUrl ? (
                    <a href={item.downloadUrl} download className="btn-ghost text-sm py-2 px-4">
                      Download
                    </a>
                  ) : (
                    <span className="text-xs text-[var(--muted)]">Processing…</span>
                  )}
                </div>
              ))}
            </div>
          )}

          <a href="/" className="btn-ghost inline-block">Browse More Beats</a>
        </>
      )}
    </div>
  )
}

export default function SuccessPage() {
  return (
    <>
      <Navbar />
      <Suspense fallback={
        <div className="max-w-2xl mx-auto px-6 py-24 text-center">
          <div className="w-12 h-12 border-2 border-accent border-t-transparent rounded-full animate-spin mx-auto mb-6" />
          <p className="text-[var(--muted)]">Loading…</p>
        </div>
      }>
        <SuccessContent />
      </Suspense>
      <Footer />
    </>
  )
}