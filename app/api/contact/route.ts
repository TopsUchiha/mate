import type { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { assertSameOrigin, getClientIp, handleApiError, json, parseJson } from '@/lib/api'
import { rateLimit } from '@/lib/rate-limit'
import { contactInputSchema } from '@/lib/validation'

export async function POST(req: NextRequest) {
  try {
    assertSameOrigin(req)
    const limit = rateLimit(`contact:${getClientIp(req)}`, 5, 60 * 60 * 1000)
    if (!limit.ok) {
      return json(
        { error: 'You have sent several messages recently. Please try again later or email us directly.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } },
      )
    }
    const { company, ...data } = await parseJson(req, contactInputSchema, 16 * 1024)
    // Honeypot tripped: pretend success so bots don't learn to adapt.
    if (company) return json({ ok: true }, 201)

    await db.contactMessage.create({ data })
    return json({ ok: true }, 201)
  } catch (error) {
    return handleApiError(error, 'contact submit')
  }
}
