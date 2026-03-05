import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--background)] mt-8">
      <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row items-center justify-between gap-3">

        <div className="flex items-center gap-6">
          <img
            className="h-6 w-auto"
            src="https://eazzxszzohxmydikdwre.supabase.co/storage/v1/object/public/previews/coreNoReflectStampSm.png"
            alt="Corekilla"
          />
          <nav className="flex items-center gap-4">
            <Link href="/" className="text-xs text-[var(--muted)] hover:text-[var(--text)] transition-colors">Catalog</Link>
            <Link href="/licensing" className="text-xs text-[var(--muted)] hover:text-[var(--text)] transition-colors">Licensing</Link>
            <Link href="/about" className="text-xs text-[var(--muted)] hover:text-[var(--text)] transition-colors">About</Link>
            <Link href="/privacy-policy" className="text-xs text-[var(--muted)] hover:text-[var(--text)] transition-colors">Privacy</Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <p className="text-xs text-[var(--muted)] font-mono">© {new Date().getFullYear()} Corekilla</p>
          <a href="mailto:corekilla26@gmail.com" className="text-xs text-[var(--muted)] hover:text-accent transition-colors">
            Corekilla26@gmail.com
          </a>
        </div>

      </div>
    </footer>
  )
}
