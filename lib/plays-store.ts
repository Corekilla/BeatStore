import { create } from 'zustand'

interface PlaysStore {
  counts: Record<string, number>
  initBeat: (id: string, realPlays: number, displayPlays: number) => void
  increment: (id: string, amount: number) => void
  isActive: (id: string) => boolean
  boostBeat: (id: string) => void
  boosted: Record<string, number> // timestamp of last boost
  
}

export const usePlays = create<PlaysStore>((set, get) => ({
  counts: {},
  boosted: {},

  initBeat: (id, realPlays, displayPlays) => {
  if (get().counts[id] !== undefined) return
  
  if (displayPlays > 0) {
    // Already initialized in DB — use that value
    set((s) => ({ counts: { ...s.counts, [id]: displayPlays } }))
  } else {
    // First time — generate base count and persist it
    const base = realPlays + Math.floor(Math.random() * 91) + 10
    set((s) => ({ counts: { ...s.counts, [id]: base } }))
    fetch('/api/beats/display-plays', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ beatId: id, init: true, baseCount: base }),
    })
  }
},

  increment: (id, amount) => {
    set((s) => ({
      counts: { ...s.counts, [id]: (s.counts[id] ?? 0) + amount }
    }))
  },

  boostBeat: (id) => {
    set((s) => ({ boosted: { ...s.boosted, [id]: Date.now() } }))
  },

  isActive: (id) => {
    const ts = get().boosted[id]
    if (!ts) return false
    return Date.now() - ts < 2 * 60 * 1000 // 2 minute boost window
  },
}))