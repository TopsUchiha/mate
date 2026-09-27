import type { NextRequest } from 'next/server'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { ApiError, assertSameOrigin, getClientIp, handleApiError, json, parseJson } from '@/lib/api'
import { loginSchema } from '@/lib/validation'
import { rateLimit, resetRateLimit } from '@/lib/rate-limit'
import { SESSION_COOKIE, sessionCookieOptions, signSessionToken } from '@/lib/session-token'

// Used to keep response timing similar whether or not the email exists.
const DUMMY_HASH = '$2b$12$C6UzMDM.H6dfI/f/IKcEeO5Dr5h6XJ0f6Ww0p5n5Q0p6g2ZC3bq7i'

export async function POST(req: NextRequest) {
  try {
    assertSameOrigin(req)
    const ip = getClientIp(req)
    const limit = rateLimit(`login:${ip}`, 8, 15 * 60 * 1000)
    if (!limit.ok) {
      return json(
        { error: 'Too many login attempts. Please wait a few minutes and try again.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } },
      )
    }

    const { email, password } = await parseJson(req, loginSchema, 4 * 1024)
    const admin = await db.admin.findUnique({ where: { email } })
    const valid = await bcrypt.compare(password, admin?.passwordHash ?? DUMMY_HASH)

    if (!admin || !valid) throw new ApiError(401, 'Invalid email or password.')

    resetRateLimit(`login:${ip}`)
    const token = await signSessionToken({ sub: admin.id, email: admin.email })
    const res = json({ ok: true })
    res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions())
    return res
  } catch (error) {
    return handleApiError(error, 'admin login')
  }
}
