import { Globe, Plane, ShieldCheck, Ship, ShoppingCart, Truck, Warehouse, type LucideIcon } from 'lucide-react'

export type Service = {
  slug: string
  title: string
  summary: string
  details: string[]
  icon: LucideIcon
}

export const SERVICES: Service[] = [
  {
    slug: 'air-freight',
    title: 'Air Freight',
    summary: 'Time-critical cargo moved on scheduled and charter flights to major airports worldwide.',
    details: ['Express, standard and deferred options', 'Door-to-airport and door-to-door', 'Dangerous goods handling'],
    icon: Plane,
  },
  {
    slug: 'ocean-freight',
    title: 'Ocean Freight',
    summary: 'Cost-efficient FCL and LCL container shipping across every major trade lane.',
    details: ['Full and less-than-container loads', 'Port-to-port and door-to-door', 'Reefer and oversized cargo'],
    icon: Ship,
  },
  {
    slug: 'domestic-shipping',
    title: 'Domestic Shipping',
    summary: 'Reliable LTL, FTL and parcel delivery across the continental United States.',
    details: ['Same-day and next-day regional delivery', 'Dedicated truckload capacity', 'Liftgate and residential service'],
    icon: Truck,
  },
  {
    slug: 'international-shipping',
    title: 'International Shipping',
    summary: 'End-to-end cross-border logistics with a single point of contact from pickup to delivery.',
    details: ['Multimodal routing', 'Incoterms guidance', 'Global partner network'],
    icon: Globe,
  },
  {
    slug: 'warehousing',
    title: 'Warehousing',
    summary: 'Secure, climate-aware storage with real-time inventory visibility and flexible terms.',
    details: ['Short and long-term storage', 'Cross-docking', 'Pick, pack and kitting'],
    icon: Warehouse,
  },
  {
    slug: 'customs-clearance',
    title: 'Customs Clearance',
    summary: 'Licensed brokerage support that keeps your goods compliant and moving at the border.',
    details: ['Import and export filings', 'Duty and tariff classification', 'Compliance documentation'],
    icon: ShieldCheck,
  },
  {
    slug: 'ecommerce-fulfillment',
    title: 'E-commerce Fulfillment',
    summary: 'Storefront-connected fulfillment that ships your online orders quickly and accurately.',
    details: ['Order sync with major platforms', 'Branded packaging', 'Returns management'],
    icon: ShoppingCart,
  },
]

export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/services', label: 'Services' },
  { href: '/track', label: 'Track Shipment' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const
