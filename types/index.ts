// ─── Beat & Licensing ────────────────────────────────────────────────────────

export type LicenseType = 'mp3_lease' | 'exclusive'

export interface License {
  type: LicenseType
  label: string
  price: number // in cents
  description: string
  features: string[]
  stripeProductId?: string
  stripePriceId?: string
}

export interface Beat {
  id: string
  title: string
  slug: string
  producer: string
  bpm: number
  key: string
  genre: string
  mood: string[]
  tags: string[]
  previewUrl: string       // watermarked MP3 for streaming
  coverArt: string         // public image URL
  licenses: License[]
  plays: number
  featured: boolean
  hasVocals: boolean
  leasesSold: number
  createdAt: string
  displayPlays: number
}

// ─── Cart ────────────────────────────────────────────────────────────────────

export interface CartItem {
  beat: Beat
  license: License
}

export interface Cart {
  items: CartItem[]
  addItem: (beat: Beat, license: License) => void
  removeItem: (beatId: string) => void
  clearCart: () => void
  total: number
}

// ─── Orders ──────────────────────────────────────────────────────────────────

export type OrderStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface OrderItem {
  beatId: string
  beatTitle: string
  licenseType: LicenseType
  price: number
  downloadUrl?: string
}

export interface Order {
  id: string
  userId?: string
  email: string
  stripeSessionId: string
  status: OrderStatus
  items: OrderItem[]
  total: number
  createdAt: string
}

// ─── Supabase DB Types ────────────────────────────────────────────────────────

export interface Database {
  public: {
    Tables: {
      beats: {
        Row: Beat
        Insert: Omit<Beat, 'id' | 'createdAt' | 'plays'>
        Update: Partial<Omit<Beat, 'id'>>
      }
      orders: {
        Row: Order
        Insert: Omit<Order, 'id' | 'createdAt'>
        Update: Partial<Omit<Order, 'id'>>
      }
    }
  }
}
