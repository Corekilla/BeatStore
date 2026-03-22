import { create } from 'zustand'

interface PlayerStore {
  currentBeatId: string | null
  setCurrentBeatId: (id: string | null) => void
  volume: number
  setVolume: (v: number) => void
}

export const usePlayer = create<PlayerStore>((set) => ({
  currentBeatId: null,
  setCurrentBeatId: (id) => set({ currentBeatId: id }),
  volume: 0.8,
  setVolume: (v) => set({ volume: v }),
}))