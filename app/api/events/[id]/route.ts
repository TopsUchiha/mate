import type { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { handleApiError, json, parseJson, requireAdminApi } from '@/lib/api'
import { eventPatchSchema } from '@/lib/validation'

type Ctx = { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Ctx) {
  try {
    await requireAdminApi(req, { mutation: true })
    const { id } = await params
    const input = await parseJson(req, eventPatchSchema)
    const event = await db.trackingEvent.update({ where: { id }, data: input })
    await db.shipment.update({ where: { id: event.shipmentId }, data: { updatedAt: new Date() } })
    return json({ event })
  } catch (error) {
    return handleApiError(error, 'update event')
  }
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  try {
    await requireAdminApi(req, { mutation: true })
    const { id } = await params
    await db.trackingEvent.delete({ where: { id } })
    return json({ ok: true })
  } catch (error) {
    return handleApiError(error, 'delete event')
  }
}
