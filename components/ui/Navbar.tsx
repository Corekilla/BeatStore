'use client'

import Link from 'next/link'
import { useCart } from '@/lib/cart-store'
import { usePlayer } from '@/lib/player-store'

const volumeStyles = `
  @keyframes vol-icon-breathe {
    0%, 100% { transform: scale(1);    filter: drop-shadow(0 0 0px #2cc452); opacity: 0.65; }
    50%       { transform: scale(1.18); filter: drop-shadow(0 0 5px #2cc452); opacity: 1;    }
  }
  @keyframes vol-track-pulse {
    0%, 100% { box-shadow: 0 0 0   0   transparent; }
    50%       { box-shadow: 0 0 10px 2px rgba(44, 196, 82, 0.35); }
  }
  .vol-playing .vol-icon {
    animation: vol-icon-breathe 2s ease-in-out infinite;
    color: #2cc452;
  }
  .vol-playing .vol-track {
    animation: vol-track-pulse 2s ease-in-out infinite;
    border-radius: 9999px;
  }
  .vol-playing { transition: opacity 0.3s; }
  .vol-idle    { transition: opacity 0.3s; opacity: 0.55; }
  .vol-idle:hover { opacity: 1; }
`

function VolumeIcon({ volume }: { volume: number }) {
  if (volume === 0) return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <line x1="23" y1="9" x2="17" y2="15"/><line x1="17" y1="9" x2="23" y2="15"/>
    </svg>
  )
  if (volume < 0.5) return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
    </svg>
  )
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"/>
    </svg>
  )
}

function VolumeSlider({ volume, setVolume, isPlaying, className }: {
  volume: number
  setVolume: (v: number) => void
  isPlaying: boolean
  className?: string
}) {
  return (
    <div className={`flex items-center gap-2 ${isPlaying ? 'vol-playing' : 'vol-idle'} ${className ?? ''}`}>
      <span className="vol-icon shrink-0" style={{ display: 'flex', alignItems: 'center' }}>
        <VolumeIcon volume={volume} />
      </span>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={volume}
        onChange={(e) => setVolume(parseFloat(e.target.value))}
        className="vol-track appearance-none cursor-pointer w-20 h-[3px] rounded-full outline-none hidden md:block"
        style={{
          background: `linear-gradient(to right, var(--accent) ${volume * 100}%, var(--border) ${volume * 100}%)`,
        }}
        aria-label="Volume"
      />
    </div>
  )
}

export function Navbar() {
  const itemCount = useCart((s) => s.itemCount())
  const { volume, setVolume, currentBeatId, visualizerSensitivity, setVisualizerSensitivity } = usePlayer()
  const isPlaying = currentBeatId !== null

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--background)]/90 backdrop-blur-sm">
      <style>{volumeStyles}</style>
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="font-display text-2xl tracking-tight shrink-0">
          <img className="h-8 w-auto" src="https://eazzxszzohxmydikdwre.supabase.co/storage/v1/object/public/previews/coreNoReflectStampSm.png" alt="" />
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-2 md:gap-8 text-xs md:text-sm font-medium text-[var(--muted)]">
          <Link href="/" className="hidden md:block hover:text-[var(--text)] transition-colors whitespace-nowrap">Catalog</Link>
          <Link href="/licensing" className="hidden md:block hover:text-[var(--text)] transition-colors whitespace-nowrap">Licensing</Link>
          <Link href="/about" className="hover:text-[var(--text)] transition-colors whitespace-nowrap">About</Link>
        </div>

        {/* Cart + Volume (top right) */}
        <div className="flex items-center gap-4 shrink-0">
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
          <VolumeSlider volume={volume} setVolume={setVolume} isPlaying={isPlaying} />
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-mono text-[var(--muted)] uppercase tracking-wider whitespace-nowrap">Viz</span>
            <input
              type="range"
              min={0.5}
              max={4}
              step={0.1}
              value={visualizerSensitivity ?? 2}
              onChange={(e) => setVisualizerSensitivity(parseFloat(e.target.value))}
              className="appearance-none cursor-pointer w-16 h-[3px] rounded-full outline-none"
              style={{
                background: `linear-gradient(to right, var(--accent) ${(((visualizerSensitivity ?? 2) - 0.5) / 3.5) * 100}%, var(--border) ${(((visualizerSensitivity ?? 2) - 0.5) / 3.5) * 100}%)`,
              }}
              aria-label="Visualizer sensitivity"
            />
          </div>
        </div>

      </div>
    </nav>
  )
}