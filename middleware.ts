import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll(): { name: string; value: string }[] { 
            return req.cookies.getAll() 
        },
            setAll(cookiesToSet: { name: string; value: string; options: any }[]) {
                cookiesToSet.forEach(({ name, value, options }) =>
                res.cookies.set(name, value, options)
            )
        },
      },
    }
  )
  const { data: { user } } = await supabase.auth.getUser()

  if (req.nextUrl.pathname.startsWith('/admin') &&
      !req.nextUrl.pathname.startsWith('/admin/login') &&
      !req.nextUrl.pathname.startsWith('/admin/enroll') &&
      !user) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }
  const { data: { session } } = await supabase.auth.getSession()

  // Protect all /admin routes except /admin/login
  if (req.nextUrl.pathname.startsWith('/admin') &&
      !req.nextUrl.pathname.startsWith('/admin/login') &&
      !session) {
    return NextResponse.redirect(new URL('/admin/login', req.url))
  }

  return res
}

export const config = {
  matcher: ['/admin/:path*'],
}
