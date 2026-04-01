import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase'
import { playsLimiter } from '@/lib/rate-limit'

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for') ?? '127.0.0.1'
  const { success } = await playsLimiter.limit(ip)
  if (!success) {
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment.' },
      { status: 429 }
    )
  }
  const { beatId, amount, init, baseCount } = await req.json()

  if (!beatId || typeof beatId !== 'string') {
    return NextResponse.json({ error: 'Invalid beatId' }, { status: 400 })
  }

  if (!init && (typeof amount !== 'number' || amount < 1 || amount > 10 || !Number.isInteger(amount))) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
  }

  const supabase = createSupabaseAdminClient()

  if (init) {
    await supabase.rpc('init_display_plays' as any, { beat_id: beatId, base_count: baseCount })
  } else {
    await supabase.rpc('increment_display_plays' as any, { beat_id: beatId, amount })
  }

  return NextResponse.json({ ok: true })
}