import type { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { ApiError, handleApiError, json, parseJson, requireAdminApi } from '@/lib/api'
import { shipmentPatchSchema } from '@/lib/validation'
import { geocodeLocation, getShipmentDetail, serializeShipment } from '@/lib/shipments'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(req: NextRequest, { params }: Ctx) {
  try {
    await requireAdminApi(req)
    const { id } = await params
    const shipment = await getShipmentDetail(id)
    if (!shipment) throw new ApiError(404, 'Shipment not found')
    return json({ shipment: serializeShipment(shipment) })
  } catch (error) {
    return handleApiError(error, 'get shipment')
  }
}

export async function PATCH(req: NextRequest, { params }: Ctx) {
  try {
    await requireAdminApi(req, { mutation: true })
    const { id } = await params
    const input = await parseJson(req, shipmentPatchSchema)

    const current = await db.shipment.findUnique({
      where: { id },
      select: { trackingNumber: true, currentLocation: true },
    })
    if (!current) throw new ApiError(404, 'Shipment not found')

    if (input.trackingNumber && input.trackingNumber !== current.trackingNumber) {
      const clash = await db.shipment.findUnique({ where: { trackingNumber: input.trackingNumber }, select: { id: true } })
      if (clash) {
        throw new ApiError(409, 'That tracking number is already in use.', {
          trackingNumber: ['That tracking number is already in use.'],
        })
      }
    }

    const data = { ...input }
    const locationChanged = input.currentLocation && input.currentLocation !== current.currentLocation
    const coordsProvided = input.latitude != null && input.longitude != null
    if (locationChanged && !coordsProvided) {
      const geo = await geocodeLocation(input.currentLocation!)
      data.latitude = geo?.latitude ?? null
      data.longitude = geo?.longitude ?? null
    }

    const shipment = await db.shipment.update({ where: { id }, data })
    return json({ shipment: serializeShipment(shipment) })
  } catch (error) {
    return handleApiError(error, 'update shipment')
  }
}

export async function DELETE(req: NextRequest, { params }: Ctx) {
  try {
    await requireAdminApi(req, { mutation: true })
    const { id } = await params
    // Tracking events and documents are removed by ON DELETE CASCADE.
    await db.shipment.delete({ where: { id } })
    return json({ ok: true })
  } catch (error) {
    return handleApiError(error, 'delete shipment')
  }
}
