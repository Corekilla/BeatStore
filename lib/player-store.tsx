import { create } from 'zustand'

interface PlayerStore {
  currentBeatId: string | null
  setCurrentBeatId: (id: string | null) => void
}

const usePlayerStore = create<PlayerStore>((set) => ({
  currentBeatId: null,
  setCurrentBeatId: (id) => set({ currentBeatId: id }),
}))

export function usePlayer() {
  const currentBeatId = usePlayerStore((s) => s.currentBeatId)
  const setCurrentBeatId = usePlayerStore((s) => s.setCurrentBeatId)
  return { currentBeatId, setCurrentBeatId }
}