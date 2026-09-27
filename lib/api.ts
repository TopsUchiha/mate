import 'server-only'
import { NextResponse, type NextRequest } from 'next/server'
import { Prisma } from '@prisma/client'
import { ZodError, type ZodType } from 'zod'
import { getAdminSession, type AdminSession } from '@/lib/auth'

export const GENERIC_ERROR = 'Something went wrong. Please try again.'

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public details?: Record<string, string[] | undefined>,
  ) {
    super(message)
  }
}

export function json<T>(data: T, init?: number | ResponseInit) {
  const responseInit = typeof init === 'number' ? { status: init } : init
  return NextResponse.json(data, responseInit)
}

export function getClientIp(req: NextRequest) {
  const forwarded = req.headers.get('x-forwarded-for')
  if (forwarded) return forwarded.split(',')[0]!.trim()
  return req.headers.get('x-real-ip') ?? 'unknown'
}

/**
 * CSRF defence for cookie-authenticated, state-changing requests:
 * browsers always send an Origin header on cross-site POST/PATCH/DELETE,
 * so we reject any request whose Origin does not match the host serving it.
 */
export function assertSameOrigin(req: NextRequest) {
  const origin = req.headers.get('origin')
  if (!origin) {
    const fetchSite = req.headers.get('sec-fetch-site')
    if (fetchSite && fetchSite !== 'same-origin' && fetchSite !== 'none') {
      throw new ApiError(403, 'Forbidden')
    }
    return
  }
  let originHost: string
  try {
    originHost = new URL(origin).host
  } catch {
    throw new ApiError(403, 'Forbidden')
  }
  const allowedHosts = [req.headers.get('x-forwarded-host'), req.headers.get('host'), req.nextUrl.host]
    .filter(Boolean)
    .flatMap((h) => h!.split(',').map((v) => v.trim()))
  if (!allowedHosts.includes(originHost)) {
    throw new ApiError(403, 'Forbidden')
  }
}

export async function requireAdminApi(req: NextRequest, { mutation = false } = {}): Promise<AdminSession> {
  if (mutation) assertSameOrigin(req)
  const session = await getAdminSession()
  if (!session) throw new ApiError(401, 'Authentication required')
  return session
}

export async function parseJson<T>(req: NextRequest, schema: ZodType<T>, maxBytes = 32 * 1024): Promise<T> {
  const length = Number(req.headers.get('content-length') ?? 0)
  if (length > maxBytes) throw new ApiError(413, 'Request body too large')
  let text: string
  try {
    text = await req.text()
  } catch {
    throw new ApiError(400, 'Invalid request body')
  }
  if (text.length > maxBytes) throw new ApiError(413, 'Request body too large')
  let raw: unknown
  try {
    raw = JSON.parse(text)
  } catch {
    throw new ApiError(400, 'Invalid JSON body')
  }
  return schema.parse(raw)
}

export function handleApiError(error: unknown, context: string) {
  if (error instanceof ApiError) {
    return json({ error: error.message, details: error.details }, error.status)
  }
  if (error instanceof ZodError) {
    const details: Record<string, string[]> = {}
    for (const issue of error.issues) {
      const key = issue.path.join('.') || 'form'
      ;(details[key] ??= []).push(issue.message)
    }
    return json({ error: 'Please check the highlighted fields.', details }, 422)
  }
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === 'P2002') return json({ error: 'A record with that value already exists.' }, 409)
    if (error.code === 'P2025') return json({ error: 'Not found' }, 404)
  }
  console.error(`[api] ${context}:`, error)
  return json({ error: GENERIC_ERROR }, 500)
}
