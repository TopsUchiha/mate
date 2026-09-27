import type { NextRequest } from 'next/server'
import { assertSameOrigin, handleApiError, json } from '@/lib/api'
import { SESSION_COOKIE, sessionCookieOptions } from '@/lib/session-token'

export async function POST(req: NextRequest) {
  try {
    assertSameOrigin(req)
    const res = json({ ok: true })
    res.cookies.set(SESSION_COOKIE, '', { ...sessionCookieOptions(), maxAge: 0 })
    return res
  } catch (error) {
    return handleApiError(error, 'admin logout')
  }
}
