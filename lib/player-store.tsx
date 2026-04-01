import { create } from 'zustand'

interface PlayerStore {
  currentBeatId: string | null
  setCurrentBeatId: (id: string | null) => void
  volume: number
  setVolume: (v: number) => void
  visualizerSensitivity: number
  setVisualizerSensitivity: (v: number) => void
}

export const usePlayer = create<PlayerStore>((set) => ({
  currentBeatId: null,
  setCurrentBeatId: (id) => set({ currentBeatId: id }),
  volume: 0.6,
  setVolume: (v) => set({ volume: v }),
  visualizerSensitivity: .9,
  setVisualizerSensitivity: (v) => set({ visualizerSensitivity: v }),
}))