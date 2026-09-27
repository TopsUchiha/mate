import type { Metadata } from 'next'
import Image from 'next/image'
import { CircleCheck } from 'lucide-react'
import { PageHero } from '@/components/site/section-heading'
import { CtaBand } from '@/components/site/cta-band'
import { SERVICES } from '@/lib/site-content'

export const metadata: Metadata = {
  title: 'Services',
  description:
    'Air freight, ocean freight, domestic and international shipping, warehousing, customs clearance and e-commerce fulfillment from Vantage Logistics.',
  alternates: { canonical: '/services' },
}

const FEATURE_IMAGES: Record<string, { src: string; alt: string }> = {
  'air-freight': { src: '/images/air-freight.png', alt: 'Cargo being loaded into a freighter aircraft' },
  'domestic-shipping': { src: '/images/domestic-trucking.png', alt: 'Vantage truck on an American highway' },
  warehousing: { src: '/images/warehouse.png', alt: 'Organized warehouse aisles with pallets' },
}

export default function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Logistics solutions built around your cargo"
        description="Choose a single service or combine them into a fully managed supply chain. Every shipment is tracked end-to-end."
      />

      <section className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        {SERVICES.map((service) => {
          const image = FEATURE_IMAGES[service.slug]
          return (
            <article
              key={service.slug}
              id={service.slug}
              className="grid scroll-mt-24 gap-8 rounded-xl border border-border bg-card p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-center"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-11 items-center justify-center rounded-lg bg-accent text-accent-foreground">
                    <service.icon aria-hidden="true" className="size-5" />
                  </span>
                  <h2 className="font-heading text-2xl font-bold text-foreground">{service.title}</h2>
                </div>
                <p className="max-w-2xl leading-relaxed text-muted-foreground">{service.summary}</p>
                <ul className="flex flex-wrap gap-x-6 gap-y-2">
                  {service.details.map((d) => (
                    <li key={d} className="flex items-center gap-2 text-sm text-foreground">
                      <CircleCheck aria-hidden="true" className="size-4 text-brand" />
                      {d}
                    </li>
                  ))}
                </ul>
              </div>
              {image && (
                <div className="relative aspect-[16/10] w-full overflow-hidden rounded-lg md:w-80">
                  <Image src={image.src} alt={image.alt} fill sizes="(min-width: 768px) 320px, 100vw" className="object-cover" />
                </div>
              )}
            </article>
          )
        })}
      </section>

      <CtaBand />
    </>
  )
}
