import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import { createSupabaseAdminClient } from '@/lib/supabase'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  // 1. Verify the user is authenticated using their session cookie
  const cookieStore = await cookies()
  const supabaseAuth = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll() {},
      },
    }
  )

  const { data: { user } } = await supabaseAuth.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // 2. Parse the request body
  const body = await req.json()
  const { title, slug, bpm, key, genre, mood, tags, coverUrl, previewUrl, beatId, has_vocals } = body

  const supabase = createSupabaseAdminClient()

  // 3. If beatId provided, update existing row with URLs
  if (beatId) {
    const { error } = await supabase
      .from('beats')
      .update({
        cover_art: coverUrl,
        preview_url: previewUrl,
      })
      .eq('id', beatId)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  }

  // 4. Otherwise insert a new beat row and return the ID
  const { data: beat, error } = await supabase
    .from('beats')
    .insert({
      title,
      slug,
      bpm,
      key,
      genre,
      mood,
      tags,
      has_vocals: has_vocals ?? false,
      preview_url: '',
      cover_art: '',
    })
    .select('id')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ beatId: beat.id })
}