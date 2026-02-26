import Stripe from 'stripe'
import { loadStripe } from '@stripe/stripe-js'
import type { CartItem } from '@/types'

// ─── Server-side Stripe ───────────────────────────────────────────────────────
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

// ─── Browser-side Stripe ──────────────────────────────────────────────────────
let stripePromise: ReturnType<typeof loadStripe>
export function getStripe() {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
  }
  return stripePromise
}

// ─── Build line items from cart ───────────────────────────────────────────────
export function cartItemsToLineItems(items: CartItem[]): Stripe.Checkout.SessionCreateParams.LineItem[] {
  return items.map((item) => ({
    price_data: {
      currency: 'usd',
      unit_amount: item.license.price, // already in cents
      product_data: {
        name: `${item.beat.title} — ${item.license.label}`,
        description: item.license.description,
        images: [item.beat.coverArt],
        metadata: {
          beatId: item.beat.id,
          licenseType: item.license.type,
        },
      },
    },
    quantity: 1,
  }))
}
