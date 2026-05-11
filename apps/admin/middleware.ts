import PocketBase from 'pocketbase'
import { NextResponse, type NextRequest } from 'next/server'
import type { AdminRole } from '@/lib/types'

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

  const pb = new PocketBase(process.env.NEXT_PUBLIC_PB_URL ?? 'http://127.0.0.1:8090')
  pb.authStore.loadFromCookie(request.headers.get('cookie') ?? '')

  const isLoggedIn = pb.authStore.isValid

  if (!isLoggedIn) {
    if (!request.nextUrl.pathname.startsWith('/login')) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
    return response
  }

  if (request.nextUrl.pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    const adminRole = (pb.authStore.model as Record<string, unknown>)?.admin_role as AdminRole | null

    if (!adminRole) {
      return NextResponse.redirect(new URL('/login?error=unauthorized', request.url))
    }

    for (const [path, allowedRoles] of Object.entries(ROLE_ROUTES)) {
      if (
        request.nextUrl.pathname.startsWith(path) &&
        adminRole !== 'super_admin' &&
        !allowedRoles.includes(adminRole)
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
