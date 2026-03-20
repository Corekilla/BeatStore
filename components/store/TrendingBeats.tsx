'use client'

import { useEffect, useRef, useState } from 'react'
import type { Beat } from '@/types'
import { usePlays } from '@/lib/plays-store'
import { formatNumber } from '@/lib/utils'
import { usePlayer } from '@/lib/player-store'
import { useCart } from '@/lib/cart-store'
import { getLicense } from '@/lib/licenses'

const RANK_CONFIG = [
  { label: 'Most Played', color: 'text-amber-400', barColor: 'bg-amber-400', badgeBg: 'bg-amber-400/10', badgeBorder: 'border-amber-400/25' },
  { label: 'Rising Fast', color: 'text-[var(--accent)]', barColor: 'bg-[var(--accent)]', badgeBg: '', badgeBorder: '' },
  { label: 'Fan Favorite', color: 'text-rose-400',  barColor: 'bg-rose-400',  badgeBg: '', badgeBorder: '' },
]

export function TrendingBeats() {
  const [beats, setBeats] = useState<Beat[]>([])
  const { counts } = usePlays()
  const { currentBeatId, setCurrentBeatId } = usePlayer()
  const { addItem, items } = useCart()
  const inCart = (beatId: string) => items.some(({ beat }) => beat.id === beatId)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    fetch('/api/beats')
      .then((r) => r.json())
      .then(({ beats }) => {
        if (!beats) return
        const sorted = [...beats].sort((a: Beat, b: Beat) =>
          (b.displayPlays || b.plays) - (a.displayPlays || a.plays)
        )
        setBeats(sorted.slice(0, 3))
      })
  }, [])

  useEffect(() => {
    return () => { audioRef.current?.pause() }
  }, [])

  const togglePlay = (beat: Beat) => {
    if (currentBeatId === beat.id) {
      if (isPaused) {
        audioRef.current!.currentTime = 0
        audioRef.current!.play()
        setIsPaused(false)
      } else {
        audioRef.current?.pause()
        setIsPaused(true)
      }
    } else {
      audioRef.current?.pause()
      const audio = new Audio(beat.previewUrl)
      audioRef.current = audio
      audio.play()
      audio.onended = () => { setCurrentBeatId(null); setIsPaused(false) }
      setCurrentBeatId(beat.id)
      setIsPaused(false)
    }
  }

  if (beats.length === 0) return null

  const maxPlays = Math.max(...beats.map(b => counts[b.id] ?? b.displayPlays ?? b.plays ?? 0))

  return (
    <div className="flex flex-col gap-2.5 w-full">

      {/* Header — live indicator */}
      <div className="flex items-center gap-2 mb-0.5">
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-70" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
        </span>
        <p className="font-mono text-xs text-[var(--muted)] tracking-[0.2em] uppercase">
          Trending Now
        </p>
      </div>

      {beats.map((beat, i) => {
        const isPlaying = currentBeatId === beat.id && !isPaused
        const isActive  = currentBeatId === beat.id
        const displayCount = counts[beat.id] ?? beat.displayPlays ?? beat.plays ?? 0
        const popularityPct = maxPlays > 0 ? Math.round((displayCount / maxPlays) * 100) : 0
        const rank = RANK_CONFIG[i]

        return (
          <div
            key={beat.id}
            role="button"
            tabIndex={0}
            onClick={() => togglePlay(beat)}
            onKeyDown={(e) => e.key === 'Enter' && togglePlay(beat)}
            className={`relative flex items-center gap-3 bg-[var(--surface)] border rounded-sm px-4 py-3 cursor-pointer
              transition-all duration-200 group select-none
              hover:scale-[1.015] hover:shadow-lg
              ${isActive
                ? 'border-[var(--accent)]/50 shadow-md shadow-[var(--accent)]/10'
                : 'border-[var(--border)] hover:border-[var(--accent)]/25 hover:shadow-[var(--accent)]/5'
              }`}
          >
            {/* Watermark rank — purely decorative */}
            <span
              aria-hidden
              className="absolute right-3 top-1/2 -translate-y-1/2 font-black text-6xl leading-none
                         select-none pointer-events-none opacity-[0.035] text-white"
            >
              {i + 1}
            </span>

            {/* Rank number */}
            <span className={`font-mono text-xs font-bold w-5 shrink-0 ${i === 0 ? 'text-amber-400' : 'text-[var(--muted)]'}`}>
              {`0${i + 1}`}
            </span>

            {/* Cover art + play overlay */}
            <div className="relative w-11 h-11 shrink-0 overflow-hidden rounded-sm bg-[var(--surface-2)]">
              {beat.coverArt && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={beat.coverArt} alt={beat.title} className="w-full h-full object-cover" />
              )}
              <div className={`absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity duration-150
                ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
              >
                {isPlaying ? (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="white">
                    <rect x="6" y="4" width="4" height="16"/>
                    <rect x="14" y="4" width="4" height="16"/>
                  </svg>
                ) : (
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="white">
                    <polygon points="5,3 19,12 5,21"/>
                  </svg>
                )}
              </div>
            </div>

            {/* Info + popularity bar */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5 mb-0.5">
                <p className="text-sm font-medium truncate">{beat.title}</p>
                {i === 0 && (
                  <span className={`shrink-0 text-[9px] font-mono uppercase tracking-wider px-1.5 py-px rounded-sm
                    ${rank.badgeBg} ${rank.badgeBorder} border ${rank.color}`}>
                    #1
                  </span>
                )}
              </div>
              <p className="text-[10px] text-[var(--muted)] font-mono mb-2">
                {beat.bpm} BPM · {beat.genre}
              </p>
              {/* Popularity bar */}
              <div className="h-[2px] w-full bg-[var(--border)] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${rank.barColor}`}
                  style={{ width: `${popularityPct}%` }}
                />
              </div>
            </div>

            {/* Plays + label + cart */}
            <div className="shrink-0 text-right flex flex-col items-end gap-1.5 min-w-[64px]">
              <p className="text-[11px] font-mono font-semibold text-[var(--text)]">
                {formatNumber(displayCount)}
              </p>
              <p className={`text-[9px] font-mono uppercase tracking-wide ${rank.color}`}>
                {rank.label}
              </p>
              <button
                onClick={(e) => { e.stopPropagation(); addItem(beat, getLicense('mp3_lease')) }}
                className={`text-[9px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-sm border transition-all
                  ${inCart(beat.id)
                    ? 'border-[var(--accent)]/40 text-[var(--accent)] bg-[var(--accent)]/5 cursor-default'
                    : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--accent)] hover:text-[var(--accent)]'
                  }`}
                disabled={inCart(beat.id)}
              >
                {inCart(beat.id) ? '✓ Added' : '+ Cart'}
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
