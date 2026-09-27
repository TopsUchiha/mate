import type { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { ApiError, handleApiError, json, parseJson, requireAdminApi } from '@/lib/api'
import { eventInputSchema } from '@/lib/validation'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(req: NextRequest, { params }: Ctx) {
  try {
    await requireAdminApi(req)
    const { id } = await params
    const events = await db.trackingEvent.findMany({
      where: { shipmentId: id },
      orderBy: { eventDate: 'asc' },
      take: 500,
    })
    return json({ events })
  } catch (error) {
    return handleApiError(error, 'list events')
  }
}

export async function POST(req: NextRequest, { params }: Ctx) {
  try {
    await requireAdminApi(req, { mutation: true })
    const { id } = await params
    const input = await parseJson(req, eventInputSchema)
    const shipment = await db.shipment.findUnique({ where: { id }, select: { id: true } })
    if (!shipment) throw new ApiError(404, 'Shipment not found')

    const [event] = await db.$transaction([
      db.trackingEvent.create({ data: { ...input, shipmentId: id } }),
      // Touch the shipment so "last update" reflects new tracking activity.
      db.shipment.update({ where: { id }, data: { updatedAt: new Date() } }),
    ])
    return json({ event }, 201)
  } catch (error) {
    return handleApiError(error, 'create event')
  }
}
