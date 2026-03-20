'use client'

import { useEffect } from 'react'
import { usePlays as usePlays } from '@/lib/plays-store'
import type { Beat } from '@/types'

export function PlaysSimulator({ beats }: { beats: Beat[] }) {
  const { increment, isActive } = usePlays()

  useEffect(() => {
    const tick = () => {
      beats.forEach((beat) => {
        
        const boosted = isActive(beat.id)
        // Base: 5–20 second interval per beat, add 1–3 plays
        // Boosted: add 2–6 plays instead
        const roll = Math.random()
        if (roll < 0.15 || boosted) {
          const amount = boosted
            ? Math.floor(Math.random() * 5) + 2
            : Math.floor(Math.random() * 3) + 1
          increment(beat.id, amount)
          // Persist to DB
          fetch('/api/beats/display-plays', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ beatId: beat.id, amount }),
  })
}
        
      })
    }

    const interval = setInterval(tick, 5000) // tick every 5 seconds
    return () => clearInterval(interval)
  }, [beats, increment, isActive])

  return null
}