import { NextResponse, type NextRequest } from 'next/server'
import { SESSION_COOKIE, verifySessionToken } from '@/lib/session-token'

/**
 * First line of defence for the admin UI: redirect visitors without a valid,
 * unexpired session token. Every page and API route re-checks the session
 * against the database, so this is not the only protection.
 */
export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (pathname === '/admin/login') return NextResponse.next()

  const session = await verifySessionToken(req.cookies.get(SESSION_COOKIE)?.value)
  if (!session) {
    const url = req.nextUrl.clone()
    url.pathname = '/admin/login'
    url.search = ''
    return NextResponse.redirect(url)
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
