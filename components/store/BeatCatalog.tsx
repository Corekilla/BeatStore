'use client'

import { useState, useEffect } from 'react'
import type { Beat } from '@/types'
import { BeatCard } from './BeatCard'
import { PlaysSimulator } from './PlaysSimulator'


const GENRES = ['All', 'Trap', 'Hyper Trap', 'Rage', 'Boom Bap']

export function BeatCatalog() {
  const [beats, setBeats] = useState<Beat[]>([])
  const [loading, setLoading] = useState(true)
  const [genre, setGenre] = useState('All')
  const [search, setSearch] = useState('')
  const [vocalsOnly, setVocalsOnly] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams()
    if (genre !== 'All') params.set('genre', genre)
    if (search) params.set('q', search)
    if (vocalsOnly) params.set('vocals', 'true')

    setLoading(true)
    fetch(`/api/beats?${params}`)
      .then((r) => r.json())
      .then(({ beats }) => setBeats(beats ?? []))
      .finally(() => setLoading(false))
  }, [genre, search, vocalsOnly])

  return (
    <section id="catalog" className="max-w-7xl mx-auto px-6 py-16">
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-10">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <input
            type="text"
            placeholder="Search beats..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[var(--surface)] border border-[var(--border)] rounded-sm px-4 py-2.5 text-sm
                       placeholder:text-[var(--muted)] focus:outline-none focus:border-[var(--accent)] transition-colors"
          />
        </div>

        {/* Genre pills */}
        <div className="flex gap-2 flex-wrap">
          {GENRES.map((g) => (
            <button
              key={g}
              onClick={() => setGenre(g)}
              className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-sm border transition-all ${
                genre === g
                  ? 'bg-accent text-background border-accent'
                  : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      <button
      onClick={() => setVocalsOnly(!vocalsOnly)}
      className={`px-4 py-2 text-xs font-mono uppercase tracking-wider rounded-sm border transition-all flex items-center gap-2 ${
        vocalsOnly
          ? 'bg-accent text-background border-accent'
          : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
      }`}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
        <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
        <line x1="12" y1="19" x2="12" y2="23"/>
        <line x1="8" y1="23" x2="16" y2="23"/>
      </svg>
      Beats With Vocals
    </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="card h-48 animate-pulse" />
          ))}
        </div>
      ) : beats.length === 0 ? (
        <div className="text-center py-20 text-[var(--muted)]">
          <p className="text-lg">No beats found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {beats.map((beat) => (
            <BeatCard key={beat.id} beat={beat} />
          ))}
        </div>
      )}
      {!loading && beats.length > 0 && <PlaysSimulator beats={beats} />}
    </section>
  )
}
