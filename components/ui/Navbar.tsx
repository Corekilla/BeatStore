'use client'

import Link from 'next/link'
import { useCart } from '@/lib/cart-store'

export function Navbar() {
  const itemCount = useCart((s) => s.itemCount())

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="font-display text-2xl tracking-tight">
          <img className="h-8 w-auto" src="https://eazzxszzohxmydikdwre.supabase.co/storage/v1/object/public/previews/coreNoReflectStampSm.png" alt="" />
        </Link>

        {/* Nav links */}
        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-[var(--muted)]">
          <Link href="/" className="hover:text-[var(--text)] transition-colors">Catalog</Link>
          <Link href="/licenses" className="hover:text-[var(--text)] transition-colors">Licensing</Link>
          <Link href="/about" className="hover:text-[var(--text)] transition-colors">About</Link>
        </div>

        {/* Cart */}
        <Link href="/cart" className="relative flex items-center gap-2 text-sm font-medium hover:text-accent transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          Cart
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-accent text-background text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </Link>
      </div>
    </nav>
  )
}
