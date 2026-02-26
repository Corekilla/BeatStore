import { NextRequest, NextResponse } from 'next/server'
import { createSupabaseAdminClient } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const genre = searchParams.get('genre')
  const mood = searchParams.get('mood')
  const bpmMin = searchParams.get('bpmMin')
  const bpmMax = searchParams.get('bpmMax')
  const search = searchParams.get('q')
  const featured = searchParams.get('featured')

  const supabase = createSupabaseAdminClient()

  let query = supabase.from('beats').select('*').order('created_at', { ascending: false })

  if (genre) query = query.eq('genre', genre)
  if (bpmMin) query = query.gte('bpm', parseInt(bpmMin))
  if (bpmMax) query = query.lte('bpm', parseInt(bpmMax))
  if (featured === 'true') query = query.eq('featured', true)
  if (search) query = query.ilike('title', `%${search}%`)

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ beats: data })
}
