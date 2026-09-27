import type { NextRequest } from 'next/server'
import { getClientIp, handleApiError, json } from '@/lib/api'
import { rateLimit } from '@/lib/rate-limit'
import { getPublicTracking } from '@/lib/shipments'
import { trackingNumberSchema } from '@/lib/validation'

type Ctx = { params: Promise<{ trackingNumber: string }> }

export async function GET(req: NextRequest, { params }: Ctx) {
  try {
    const limit = rateLimit(`track:${getClientIp(req)}`, 60, 60 * 1000)
    if (!limit.ok) {
      return json(
        { error: 'Too many requests. Please try again shortly.' },
        { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } },
      )
    }
    const { trackingNumber } = await params
    const parsed = trackingNumberSchema.safeParse(decodeURIComponent(trackingNumber))
    if (!parsed.success) {
      return json({ error: 'Please enter a valid tracking number, e.g. VGL-8291047.' }, 400)
    }
    const shipment = await getPublicTracking(parsed.data)
    if (!shipment) return json({ error: 'Shipment not found' }, 404)
    return json({ shipment }, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    return handleApiError(error, 'public tracking')
  }
}
