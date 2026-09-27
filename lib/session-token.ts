import { SignJWT, jwtVerify } from 'jose'

export const SESSION_COOKIE = 'vgl_admin_session'
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 8

export type SessionPayload = { sub: string; email: string }

function getSecret() {
  const secret = process.env.AUTH_SECRET
  if (!secret || secret.length < 32) {
    throw new Error('AUTH_SECRET must be set and at least 32 characters long')
  }
  return new TextEncoder().encode(secret)
}

export async function signSessionToken(payload: SessionPayload) {
  return new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE_SECONDS}s`)
    .setIssuer('vantage-logistics')
    .setAudience('vantage-admin')
    .sign(getSecret())
}

export async function verifySessionToken(token: string | undefined): Promise<SessionPayload | null> {
  if (!token) return null
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      issuer: 'vantage-logistics',
      audience: 'vantage-admin',
      algorithms: ['HS256'],
    })
    if (typeof payload.sub !== 'string' || typeof payload.email !== 'string') return null
    return { sub: payload.sub, email: payload.email }
  } catch {
    return null
  }
}

export function sessionCookieOptions() {
  const isProd = process.env.NODE_ENV === 'production'
  return {
    httpOnly: true,
    secure: true,
    // The v0 dev preview renders inside a cross-site iframe, which requires SameSite=None.
    sameSite: isProd ? ('lax' as const) : ('none' as const),
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  }
}
