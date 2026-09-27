import 'server-only'
import { randomInt } from 'node:crypto'
import { Prisma, type ShipmentStatus } from '@prisma/client'
import { db } from '@/lib/db'
import { PAGE_SIZE } from '@/lib/constants'

export async function generateTrackingNumber() {
  for (let attempt = 0; attempt < 10; attempt++) {
    const candidate = `VGL-${randomInt(1_000_000, 10_000_000)}`
    const exists = await db.shipment.findUnique({ where: { trackingNumber: candidate }, select: { id: true } })
    if (!exists) return candidate
  }
  throw new Error('Unable to generate a unique tracking number')
}

export async function listShipments({ q, status, page }: { q: string; status?: ShipmentStatus; page: number }) {
  const where: Prisma.ShipmentWhereInput = {
    ...(status ? { status } : {}),
    ...(q
      ? {
          OR: [
            { trackingNumber: { contains: q, mode: 'insensitive' } },
            { senderName: { contains: q, mode: 'insensitive' } },
            { receiverName: { contains: q, mode: 'insensitive' } },
            { origin: { contains: q, mode: 'insensitive' } },
            { destination: { contains: q, mode: 'insensitive' } },
            { currentLocation: { contains: q, mode: 'insensitive' } },
          ],
        }
      : {}),
  }
  const [items, total] = await db.$transaction([
    db.shipment.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      select: {
        id: true,
        trackingNumber: true,
        senderName: true,
        receiverName: true,
        origin: true,
        destination: true,
        status: true,
        currentLocation: true,
        estimatedDelivery: true,
        updatedAt: true,
      },
    }),
    db.shipment.count({ where }),
  ])
  return { items, total, page, pageCount: Math.max(1, Math.ceil(total / PAGE_SIZE)) }
}

export async function getShipmentDetail(id: string) {
  return db.shipment.findUnique({
    where: { id },
    include: {
      events: { orderBy: { eventDate: 'asc' } },
      documents: {
        orderBy: { createdAt: 'desc' },
        select: { id: true, fileName: true, fileUrl: true, fileType: true, fileSize: true, createdAt: true },
      },
    },
  })
}

/** Public-safe projection: no sender/receiver contact details or internal IDs. */
export async function getPublicTracking(trackingNumber: string) {
  const shipment = await db.shipment.findUnique({
    where: { trackingNumber },
    select: {
      trackingNumber: true,
      status: true,
      currentLocation: true,
      latitude: true,
      longitude: true,
      origin: true,
      destination: true,
      packageType: true,
      weight: true,
      estimatedDelivery: true,
      createdAt: true,
      updatedAt: true,
      events: {
        orderBy: { eventDate: 'asc' },
        select: { id: true, status: true, location: true, description: true, eventDate: true },
      },
    },
  })
  if (!shipment) return null
  return {
    ...shipment,
    weight: shipment.weight.toString(),
    estimatedDelivery: shipment.estimatedDelivery?.toISOString() ?? null,
    createdAt: shipment.createdAt.toISOString(),
    updatedAt: shipment.updatedAt.toISOString(),
    events: shipment.events.map((e) => ({ ...e, eventDate: e.eventDate.toISOString() })),
  }
}

export type PublicTracking = NonNullable<Awaited<ReturnType<typeof getPublicTracking>>>

export async function getDashboardStats() {
  const [grouped, total, unread] = await db.$transaction([
    db.shipment.groupBy({ by: ['status'], orderBy: { status: 'asc' }, _count: { _all: true } }),
    db.shipment.count(),
    db.contactMessage.count({ where: { read: false } }),
  ])
  const byStatus = Object.fromEntries(
    grouped.map((g) => [g.status, typeof g._count === 'object' ? (g._count._all ?? 0) : 0]),
  ) as Partial<Record<ShipmentStatus, number>>
  return { total, unread, byStatus }
}

export function serializeShipment<T extends { weight: Prisma.Decimal }>(shipment: T) {
  return { ...shipment, weight: shipment.weight.toString() }
}

/** Resolves a free-text location to coordinates using Mapbox, if a token is configured. */
export async function geocodeLocation(query: string): Promise<{ latitude: number; longitude: number } | null> {
  const token = process.env.MAPBOX_PUBLIC_TOKEN || process.env.NEXT_PUBLIC_MAPBOX_TOKEN
  if (!token || !query) return null
  try {
    const url = new URL('https://api.mapbox.com/search/geocode/v6/forward')
    url.searchParams.set('q', query)
    url.searchParams.set('limit', '1')
    url.searchParams.set('access_token', token)
    const res = await fetch(url, { signal: AbortSignal.timeout(4000) })
    if (!res.ok) return null
    const data = (await res.json()) as { features?: { geometry?: { coordinates?: [number, number] } }[] }
    const coords = data.features?.[0]?.geometry?.coordinates
    if (!coords) return null
    return { longitude: coords[0], latitude: coords[1] }
  } catch (error) {
    console.error('[geocode] failed:', error)
    return null
  }
}
