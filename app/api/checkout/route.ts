import { NextRequest, NextResponse } from 'next/server'
import { stripe, cartItemsToLineItems } from '@/lib/stripe'
import { createSupabaseAdminClient } from '@/lib/supabase'
import type { CartItem } from '@/types'

export async function POST(req: NextRequest) {
  const { items, email, marketingOptIn }: { items: CartItem[]; email?: string; marketingOptIn?: boolean } = await req.json()

  if (!items || items.length === 0) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL
  const supabase = createSupabaseAdminClient()

  try {
    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: cartItemsToLineItems(items),
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/cart`,
      metadata: {
        items: JSON.stringify(
          items.map((i) => ({
            beatId: i.beat.id,
            beatTitle: i.beat.title,
            licenseType: i.license.type,
            price: i.license.price,
          }))
        ),
      },
    })

    // Save marketing opt-in
    if (marketingOptIn && email) {
      await supabase
        .from('email_subscribers')
        .upsert({ email }, { onConflict: 'email' })
    }

    // Create a pending order in Supabase
    await supabase.from('orders').insert({
      email: email ?? '',
      stripe_session_id: session.id,
      status: 'pending',
      items: items.map((i) => ({
        beatId: i.beat.id,
        beatTitle: i.beat.title,
        licenseType: i.license.type,
        price: i.license.price,
      })),
      total: items.reduce((sum, i) => sum + i.license.price, 0),
    })

    return NextResponse.json({ url: session.url })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Checkout failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}