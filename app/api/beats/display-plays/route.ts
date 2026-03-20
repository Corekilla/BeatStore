import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase'

export async function POST(req: NextRequest) {
  const { beatId, amount, init, baseCount } = await req.json()
  const supabase = createSupabaseAdminClient()

  if (init) {
    await supabase.rpc('init_display_plays' as any, { beat_id: beatId, base_count: baseCount })
  } else {
    await supabase.rpc('increment_display_plays' as any, { beat_id: beatId, amount })
  }

  return NextResponse.json({ ok: true })
}