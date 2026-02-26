import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Beat, License, CartItem } from '@/types'

interface CartStore {
  items: CartItem[]
  addItem: (beat: Beat, license: License) => void
  removeItem: (beatId: string) => void
  updateLicense: (beatId: string, license: License) => void
  clearCart: () => void
  total: () => number
  itemCount: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (beat, license) => {
        set((state) => {
          const existing = state.items.findIndex((i) => i.beat.id === beat.id)
          if (existing >= 0) {
            // Update license if beat already in cart
            const updated = [...state.items]
            updated[existing] = { beat, license }
            return { items: updated }
          }
          return { items: [...state.items, { beat, license }] }
        })
      },

      removeItem: (beatId) => {
        set((state) => ({
          items: state.items.filter((i) => i.beat.id !== beatId),
        }))
      },

      updateLicense: (beatId, license) => {
        set((state) => ({
          items: state.items.map((i) =>
            i.beat.id === beatId ? { ...i, license } : i
          ),
        }))
      },

      clearCart: () => set({ items: [] }),

      total: () =>
        get().items.reduce((sum, item) => sum + item.license.price, 0),

      itemCount: () => get().items.length,
    }),
    { name: 'beatstore-cart' }
  )
)
