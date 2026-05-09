import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { AdminRole } from '@/lib/supabase/types'

// Routes accessible per role (super_admin passes all checks)
const ROLE_ROUTES: Record<string, AdminRole[]> = {
  '/dashboard/stories':   ['content_manager', 'translator'],
  '/dashboard/shlokas':   ['content_manager', 'translator'],
  '/dashboard/quizzes':   ['content_manager', 'translator'],
  '/dashboard/analytics': ['analytics_viewer'],
  '/dashboard/users':     ['super_admin'],
  '/dashboard/badges':    ['super_admin'],
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  const { data: { user } } = await supabase.auth.getUser()

  // Unauthenticated → login
  if (!user) {
    if (!request.nextUrl.pathname.startsWith('/login')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return response
  }

  // Authenticated on /login → redirect to dashboard
  if (request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Fetch admin role from profiles (only for /dashboard routes)
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('admin_role')
      .eq('id', user.id)
      .single()

    // No admin role = regular app user, not allowed in admin panel
    if (!profile?.admin_role) {
      return NextResponse.redirect(new URL('/login?error=unauthorized', request.url))
    }

    const role = profile.admin_role as AdminRole

    // Check section-level access
    for (const [path, allowedRoles] of Object.entries(ROLE_ROUTES)) {
      if (
        request.nextUrl.pathname.startsWith(path) &&
        role !== 'super_admin' &&
        !allowedRoles.includes(role)
      ) {
        return NextResponse.redirect(new URL('/dashboard', request.url))
      }
    }
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/).*)'],
}
