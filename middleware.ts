import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('accessToken')?.value
  const { pathname } = request.nextUrl

  // 1. If user is NOT logged in and trying to access protected routes (dashboard, etc.), redirect to /login
  const isAuthRoute = pathname === '/login' || pathname === '/signup' || pathname === '/forgot-password' || pathname === '/reset-password'
  const isPublicRoute = pathname === '/' || isAuthRoute || pathname === '/success' || pathname.startsWith('/traveling')

  if (!token && !isPublicRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // 2. If user IS logged in and trying to access auth routes, redirect to /
  if (token && (pathname === '/login' || pathname === '/signup')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  // 3. For the root path '/', allow access even if logged in
  if (pathname === '/') {
    return NextResponse.next()
  }


  return NextResponse.next()
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - assest (public assets folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|assest).*)',
  ],
}
