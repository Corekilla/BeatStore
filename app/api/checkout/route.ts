import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createSupabaseAdminClient } from '@/lib/supabase'
import { getLicense } from '@/lib/licenses'
import type { CartItem } from '@/types'

export async function POST(req: NextRequest) {
  const { items, email, marketingOptIn }: { items: CartItem[]; email?: string; marketingOptIn?: boolean } = await req.json()

  if (!items || items.length === 0) {
    return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
  }

  //  Look up prices server-side 
  const verifiedItems = items.map((i) => {
    const license = getLicense(i.license.type)
    if (!license) throw new Error(`Invalid license type: ${i.license.type}`)
    return {
      beatId: i.beat.id,
      beatTitle: i.beat.title,
      licenseType: license.type,
      price: license.price, // server-side price only
    }
  })

  const appUrl = process.env.NEXT_PUBLIC_APP_URL
  const supabase = createSupabaseAdminClient()

  try {
    // Build Stripe line items from verified prices
    const lineItems = verifiedItems.map((item) => ({
      price_data: {
        currency: 'usd',
        unit_amount: item.price, 
        product_data: {
          name: `${item.beatTitle} — ${item.licenseType.replace('_', ' ').toUpperCase()}`,
        },
      },
      quantity: 1,
    }))

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card'],
      customer_email: email,
      line_items: lineItems,
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/cart`,
      metadata: {
        items: JSON.stringify(verifiedItems),
      },
    })

    // Save marketing opt-in
    if (marketingOptIn && email) {
      await supabase
        .from('email_subscribers')
        .upsert({ email }, { onConflict: 'email' })
    }

    // Create pending order with verified prices
    await supabase.from('orders').insert({
      email: email ?? '',
      stripe_session_id: session.id,
      status: 'pending',
      items: verifiedItems,
      total: verifiedItems.reduce((sum, i) => sum + i.price, 0),
    })

    return NextResponse.json({ url: session.url })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Checkout failed'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}