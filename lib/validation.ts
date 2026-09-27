import { z } from 'zod'
import { SHIPMENT_STATUSES, TRACKING_NUMBER_REGEX } from '@/lib/constants'

// Strip ASCII control characters (except tab/newline) from user-supplied text.
const clean = (value: string) => value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '').trim()

const text = (max: number, label: string) =>
  z
    .string({ error: `${label} is required` })
    .transform(clean)
    .pipe(z.string().min(1, `${label} is required`).max(max, `${label} must be ${max} characters or fewer`))

const optionalText = (max: number) =>
  z
    .string()
    .transform(clean)
    .pipe(z.string().max(max))
    .optional()
    .nullable()
    .transform((v) => (v ? v : null))

export const trackingNumberSchema = z
  .string()
  .transform((v) => v.trim().toUpperCase())
  .pipe(z.string().regex(TRACKING_NUMBER_REGEX, 'Tracking numbers look like VGL-8291047'))

const dateInput = z
  .string()
  .refine((v) => !Number.isNaN(Date.parse(v)), 'Enter a valid date')
  .transform((v) => new Date(v))

const coordinate = (min: number, max: number) => z.number().finite().min(min).max(max).nullable().optional()

export const shipmentInputSchema = z.object({
  trackingNumber: z
    .union([trackingNumberSchema, z.literal('')])
    .optional()
    .transform((v) => (v ? v : undefined)),
  senderName: text(120, 'Sender name'),
  receiverName: text(120, 'Receiver name'),
  senderContact: text(160, 'Sender contact'),
  receiverContact: text(160, 'Receiver contact'),
  origin: text(160, 'Origin'),
  destination: text(160, 'Destination'),
  packageType: text(80, 'Package type'),
  weight: z.coerce
    .number({ error: 'Weight must be a number' })
    .positive('Weight must be greater than 0')
    .max(1_000_000, 'Weight is too large'),
  status: z.enum(SHIPMENT_STATUSES),
  currentLocation: text(160, 'Current location'),
  latitude: coordinate(-90, 90),
  longitude: coordinate(-180, 180),
  estimatedDelivery: z
    .union([dateInput, z.literal(''), z.null()])
    .optional()
    .transform((v) => (v instanceof Date ? v : null)),
})

export const shipmentPatchSchema = shipmentInputSchema.partial()

export type ShipmentInput = z.infer<typeof shipmentInputSchema>

export const eventInputSchema = z.object({
  status: text(80, 'Status'),
  location: text(160, 'Location'),
  description: text(1000, 'Description'),
  eventDate: dateInput,
})

export const eventPatchSchema = eventInputSchema.partial()

export const contactInputSchema = z.object({
  name: text(120, 'Name'),
  email: z
    .string()
    .trim()
    .toLowerCase()
    .max(200)
    .pipe(z.email('Enter a valid email address')),
  phone: optionalText(40).refine((v) => !v || /^[+()\d\s.-]{6,40}$/.test(v), 'Enter a valid phone number'),
  subject: text(160, 'Subject'),
  message: text(5000, 'Message').refine((v) => v.length >= 10, 'Message must be at least 10 characters'),
  // Honeypot field: real visitors never fill this in.
  company: z.string().max(200).optional(),
})

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().max(200).pipe(z.email('Enter a valid email address')),
  password: z.string().min(1, 'Password is required').max(200),
})

export const messagePatchSchema = z.object({ read: z.boolean() })

export const shipmentListQuerySchema = z.object({
  q: z.string().trim().max(100).optional().default(''),
  status: z.enum(SHIPMENT_STATUSES).optional().catch(undefined),
  page: z.coerce.number().int().min(1).max(10_000).optional().default(1).catch(1),
})

export const messageListQuerySchema = z.object({
  q: z.string().trim().max(100).optional().default(''),
  filter: z.enum(['all', 'unread', 'read']).optional().default('all').catch('all'),
  page: z.coerce.number().int().min(1).max(10_000).optional().default(1).catch(1),
})
