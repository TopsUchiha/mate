import type { NextRequest } from 'next/server'
import { db } from '@/lib/db'
import { ApiError, handleApiError, json, parseJson, requireAdminApi } from '@/lib/api'
import { shipmentInputSchema, shipmentListQuerySchema } from '@/lib/validation'
import { geocodeLocation, generateTrackingNumber, listShipments, serializeShipment } from '@/lib/shipments'

export async function GET(req: NextRequest) {
  try {
    await requireAdminApi(req)
    const query = shipmentListQuerySchema.parse(Object.fromEntries(req.nextUrl.searchParams))
    const result = await listShipments(query)
    return json(result)
  } catch (error) {
    return handleApiError(error, 'list shipments')
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdminApi(req, { mutation: true })
    const input = await parseJson(req, shipmentInputSchema)

    const trackingNumber = input.trackingNumber ?? (await generateTrackingNumber())
    const existing = await db.shipment.findUnique({ where: { trackingNumber }, select: { id: true } })
    if (existing) {
      throw new ApiError(409, 'That tracking number is already in use.', {
        trackingNumber: ['That tracking number is already in use.'],
      })
    }

    let { latitude, longitude } = input
    if (latitude == null || longitude == null) {
      const geo = await geocodeLocation(input.currentLocation)
      latitude = geo?.latitude ?? null
      longitude = geo?.longitude ?? null
    }

    const shipment = await db.shipment.create({
      data: {
        ...input,
        trackingNumber,
        latitude,
        longitude,
        events: {
          create: {
            status: 'Shipment Created',
            location: input.origin,
            description: 'Shipment information received and registered with Vantage Logistics.',
            eventDate: new Date(),
          },
        },
      },
    })
    return json({ shipment: serializeShipment(shipment) }, 201)
  } catch (error) {
    return handleApiError(error, 'create shipment')
  }
}
