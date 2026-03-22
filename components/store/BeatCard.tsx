'use client'

import { useState, useRef, useEffect } from 'react'
import type { Beat } from '@/types'
import { useCart } from '@/lib/cart-store'
import { usePlayer } from '@/lib/player-store'
import { usePlays } from '@/lib/plays-store'
import { getLicense } from '@/lib/licenses'
import { formatPrice, formatNumber } from '@/lib/utils'

interface BeatCardProps {
  beat: Beat
}

export function BeatCard({ beat }: BeatCardProps) {
  const [selectedLicense, setSelectedLicense] = useState<'mp3_lease' | 'exclusive'>('mp3_lease')
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const addItem = useCart((s) => s.addItem)
  const cartItems = useCart((s) => s.items)
  const { currentBeatId, setCurrentBeatId, volume } = usePlayer()
  const { counts, initBeat, boostBeat } = usePlays()

  const inCart = cartItems.some((i) => i.beat.id === beat.id)
  const license = getLicense(selectedLicense)
  const isPlaying = currentBeatId === beat.id

  useEffect(() => {
    initBeat(beat.id, beat.plays, beat.displayPlays)
  }, [beat.id, beat.plays, beat.displayPlays])

  useEffect(() => {
    if (currentBeatId !== beat.id && audioRef.current) {
      audioRef.current.pause()
    }
  }, [currentBeatId, beat.id])

  // Sync global volume to this card's audio
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume
  }, [volume])

  const displayedPlays = counts[beat.id] ?? beat.plays

  const togglePlay = () => {
    if (!audioRef.current) {
      audioRef.current = new Audio(beat.previewUrl)
      audioRef.current.volume = volume
      audioRef.current.onended = () => setCurrentBeatId(null)
    }

    if (isPlaying) {
      audioRef.current.pause()
      setCurrentBeatId(null)
    } else {
      audioRef.current.play()
      setCurrentBeatId(beat.id)
      boostBeat(beat.id)
      fetch('/api/beats/play', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ beatId: beat.id }),
      })
    }
  }

  const handleAddToCart = () => {
    addItem(beat, license)
  }

  return (
    <div className="card group relative overflow-hidden transition-all duration-300 hover:border-[var(--accent)]/40">
      {/* Cover art */}
      <div className="relative h-40 bg-[var(--surface-2)] overflow-hidden">
        {beat.coverArt ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={beat.coverArt}
            alt={beat.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-[var(--border)] flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="var(--muted)">
                <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
              </svg>
            </div>
          </div>
        )}

        {/* Play overlay */}
        <button
          onClick={togglePlay}
          className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label={isPlaying ? 'Pause' : 'Play preview'}
        >
          {isPlaying ? (
            <div className="flex items-end gap-[3px] h-8">
              {[14, 20, 16, 24, 18].map((h, i) => (
                <span
                  key={i}
                  className="waveform-bar"
                  style={{ height: `${h}px`, animationDelay: `${i * 0.1}s` }}
                />
              ))}
            </div>
          ) : (
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--background)">
                <polygon points="5,3 19,12 5,21"/>
              </svg>
            </div>
          )}
        </button>
      </div>

      {/* Info */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-display text-lg leading-tight">{beat.title}</h3>
              {beat.hasVocals && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 mt-1" style={{color: 'var(--accent)'}}>
                  <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
                  <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
                  <line x1="12" y1="19" x2="12" y2="23"/>
                  <line x1="8" y1="23" x2="16" y2="23"/>
                </svg>
              )}
            </div>
            <p className="text-xs text-[var(--muted)] mt-0.5 font-mono">
              {beat.bpm} BPM · {beat.key} · {beat.genre}
            </p>
            {beat.leasesSold > 0 && (
              <p className="text-[10px] font-mono text-red-500 mt-0.5">
                ⚠ {beat.leasesSold} lease{beat.leasesSold > 1 ? 's' : ''} sold — exclusives may have limitations
              </p>
            )}
          </div>
          <div className="text-right">
            <p className="text-accent font-mono font-medium text-sm">{formatPrice(license.price)}</p>
          </div>
        </div>

        {/* License selector */}
        <div className="flex gap-1 mb-3 flex-wrap">
          {(['mp3_lease', 'exclusive'] as const).map((type) => {
            const l = getLicense(type)
            return (
              <button
                key={type}
                onClick={() => setSelectedLicense(type)}
                className={`text-[10px] font-mono uppercase tracking-wider px-2 py-1 rounded-sm border transition-all ${
                  selectedLicense === type
                    ? 'border-accent text-accent'
                    : 'border-[var(--border)] text-[var(--muted)] hover:border-[var(--muted)]'
                }`}
              >
                {l.label.replace(' Lease', '').replace(' Rights', '')}
              </button>
            )
          })}
        </div>

        {/* Add to cart */}
        <button
          onClick={handleAddToCart}
          disabled={inCart}
          className={`w-full py-2.5 text-sm font-medium tracking-wide uppercase transition-all rounded-sm ${
            inCart
              ? 'bg-[var(--surface-2)] text-[var(--muted)] cursor-default border border-[var(--border)]'
              : 'btn-primary'
          }`}
        >
          {inCart ? '✓ In Cart' : 'Add to Cart'}
        </button>

        {/* Plays */}
        <p className="text-[10px] text-[var(--muted)] font-mono mt-2 text-center">
          {formatNumber(displayedPlays)} plays
        </p>
      </div>
    </div>
  )
}