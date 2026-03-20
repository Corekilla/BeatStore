import { TrendingBeats } from '@/components/store/TrendingBeats'

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--border)] py-24 px-6">
      {/* Background grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(var(--text) 1px, transparent 1px), linear-gradient(90deg, var(--text) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Accent glow */}
      <div className="absolute top-0 left-1/3 w-96 h-96 rounded-full bg-accent opacity-[0.04] blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Left — copy */}
        <div>
          <p className="font-mono text-xs text-[var(--accent)] tracking-[0.3em] uppercase mb-6">
            Premium Beats
          </p>
          <h1 className="font-display text-6xl md:text-8xl leading-none tracking-tight mb-6 max-w-2xl">
            Sounds That<br />
            <span className="text-accent">Hit Different.</span>
          </h1>
          <p className="text-[var(--muted)] text-lg max-w-md mb-4">
            Exclusive and non-exclusive beats for artists who don't settle.
            Instant delivery. No AI. Professional quality.
          </p>
          <p className="font-mono text-xs text-[var(--accent)] tracking-[0.2em] uppercase mb-10">
            New beats every week.
          </p>
          <a href="#catalog" className="btn-primary inline-block text-sm tracking-wide uppercase">
            Browse Beats
          </a>
        </div>

        {/* Right — trending */}
        <div className="hidden md:block">
          <TrendingBeats />
        </div>
      </div>
    </section>
  )
}