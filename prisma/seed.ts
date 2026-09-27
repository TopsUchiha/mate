import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function seedAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const password = process.env.ADMIN_PASSWORD
  if (!email || !password) {
    throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set to seed the admin account.')
  }
  if (password.length < 10) {
    throw new Error('ADMIN_PASSWORD must be at least 10 characters.')
  }
  const passwordHash = await bcrypt.hash(password, 12)
  await prisma.admin.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash },
  })
  console.log(`Admin account ready: ${email}`)
}

const day = 24 * 60 * 60 * 1000

async function seedSampleShipments() {
  if (process.env.SEED_SAMPLE_DATA === 'false') return
  const now = Date.now()

  const samples = [
    {
      trackingNumber: 'VGL-8291047',
      senderName: 'Hartwell Components Ltd.',
      receiverName: 'Marcus Delaney',
      senderContact: 'shipping@hartwell.example · +44 20 7946 0958',
      receiverContact: 'marcus.delaney@example.com · +1 614 555 0142',
      origin: 'London, United Kingdom',
      destination: 'Columbus, Ohio, USA',
      packageType: 'Pallet',
      weight: 184.5,
      status: 'IN_TRANSIT' as const,
      currentLocation: 'New York, USA',
      latitude: 40.6413,
      longitude: -73.7781,
      estimatedDelivery: new Date(now + 3 * day),
      events: [
        { status: 'Shipment Created', location: 'London, United Kingdom', description: 'Shipment information received.', eventDate: new Date(now - 5 * day) },
        { status: 'Picked Up', location: 'London, United Kingdom', description: 'Collected from sender facility.', eventDate: new Date(now - 4.6 * day) },
        { status: 'Departed Origin', location: 'Heathrow Airport, London', description: 'Departed on international air freight.', eventDate: new Date(now - 3.8 * day) },
        { status: 'Customs Clearance', location: 'JFK Airport, New York', description: 'Cleared U.S. customs inspection.', eventDate: new Date(now - 2.2 * day) },
        { status: 'In Transit', location: 'New York, USA', description: 'In transit to regional hub in Ohio.', eventDate: new Date(now - 0.5 * day) },
      ],
    },
    {
      trackingNumber: 'VGL-5503218',
      senderName: 'Blue Harbor Textiles',
      receiverName: 'Sunbury Retail Co.',
      senderContact: 'ops@blueharbor.example',
      receiverContact: 'receiving@sunburyretail.example',
      origin: 'Chicago, Illinois, USA',
      destination: 'Sunbury, Ohio, USA',
      packageType: 'Box',
      weight: 22,
      status: 'DELIVERED' as const,
      currentLocation: 'Sunbury, Ohio, USA',
      latitude: 40.2426,
      longitude: -82.8591,
      estimatedDelivery: new Date(now - 1 * day),
      events: [
        { status: 'Shipment Created', location: 'Chicago, Illinois, USA', description: 'Shipment information received.', eventDate: new Date(now - 4 * day) },
        { status: 'Picked Up', location: 'Chicago, Illinois, USA', description: 'Collected from sender.', eventDate: new Date(now - 3.5 * day) },
        { status: 'Arrived at Facility', location: 'Columbus, Ohio, USA', description: 'Arrived at Columbus distribution center.', eventDate: new Date(now - 2 * day) },
        { status: 'Out for Delivery', location: 'Sunbury, Ohio, USA', description: 'With local courier for delivery.', eventDate: new Date(now - 1.3 * day) },
        { status: 'Delivered', location: 'Sunbury, Ohio, USA', description: 'Delivered and signed for by recipient.', eventDate: new Date(now - 1.1 * day) },
      ],
    },
  ]

  for (const { events, ...shipment } of samples) {
    const exists = await prisma.shipment.findUnique({ where: { trackingNumber: shipment.trackingNumber } })
    if (exists) continue
    await prisma.shipment.create({ data: { ...shipment, events: { create: events } } })
    console.log(`Sample shipment created: ${shipment.trackingNumber}`)
  }
}

seedAdmin()
  .then(seedSampleShipments)
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
