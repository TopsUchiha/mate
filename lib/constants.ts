export const COMPANY = {
  name: 'Vantage Logistics',
  email: 'contact@vantagelogistics.com',
  location: 'Sunbury, Ohio, USA',
} as const

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

export const SHIPMENT_STATUSES = [
  'PENDING',
  'PROCESSING',
  'IN_TRANSIT',
  'ON_HOLD',
  'OUT_FOR_DELIVERY',
  'DELIVERED',
  'CANCELLED',
] as const

export type ShipmentStatusValue = (typeof SHIPMENT_STATUSES)[number]

export const STATUS_LABELS: Record<ShipmentStatusValue, string> = {
  PENDING: 'Pending',
  PROCESSING: 'Processing',
  IN_TRANSIT: 'In Transit',
  ON_HOLD: 'On Hold',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  CANCELLED: 'Cancelled',
}

export const EVENT_STATUS_SUGGESTIONS = [
  'Shipment Created',
  'Picked Up',
  'Departed Origin',
  'In Transit',
  'Arrived at Facility',
  'Customs Clearance',
  'On Hold',
  'Out for Delivery',
  'Delivered',
] as const

export const PACKAGE_TYPES = [
  'Envelope / Documents',
  'Small Parcel',
  'Box',
  'Pallet',
  'Crate',
  'Container (20ft)',
  'Container (40ft)',
  'Vehicle',
  'Other',
] as const

export const TRACKING_NUMBER_REGEX = /^VGL-\d{7}$/

export const PAGE_SIZE = 20

export const UPLOAD_MAX_BYTES = 5 * 1024 * 1024
export const UPLOAD_ALLOWED_MIME = ['application/pdf', 'image/png', 'image/jpeg', 'image/webp'] as const
