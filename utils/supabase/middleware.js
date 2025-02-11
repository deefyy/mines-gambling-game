import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'

export async function updateSession(request) {
  let response = NextResponse.next()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Retrieve the current user session
  const { data: { user } } = await supabase.auth.getUser()

  // If no user exists, return a redirect response
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}