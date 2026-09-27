import type { Metadata } from 'next'
import Image from 'next/image'
import { PageHero, SectionHeading } from '@/components/site/section-heading'
import { CtaBand } from '@/components/site/cta-band'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Vantage Logistics is a freight forwarding and logistics company headquartered in Sunbury, Ohio, serving businesses worldwide.',
  alternates: { canonical: '/about' },
}

const VALUES = [
  { title: 'Transparency', body: 'Clear pricing, honest timelines and tracking you can check any time.' },
  { title: 'Reliability', body: 'We plan for contingencies so your cargo keeps moving when conditions change.' },
  { title: 'Care', body: 'Every shipment matters to someone. We handle yours as if it were our own.' },
]

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="About us"
        title="Moving the world's goods from the heart of Ohio"
        description="Vantage Logistics connects businesses to markets across the globe with dependable freight and full shipment visibility."
      />

      <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:px-8">
        <div className="flex flex-col gap-5 leading-relaxed text-muted-foreground">
          <SectionHeading eyebrow="Our story" title="Built for businesses that ship with purpose" />
          <p>
            Headquartered in Sunbury, Ohio, Vantage Logistics was founded to give growing businesses the kind of
            logistics support usually reserved for the largest shippers. Our central location puts us within a
            day&apos;s drive of much of the U.S. population and close to major air and rail gateways.
          </p>
          <p>
            Today our team coordinates air, ocean and ground freight, operates warehousing and fulfillment, and
            manages customs clearance for clients around the world — all backed by a tracking system that
            records every milestone.
          </p>
        </div>
        <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
          <Image
            src="/images/operations-team.png"
            alt="Vantage Logistics operations team reviewing shipments"
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </section>

      <section className="bg-secondary">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
          <SectionHeading eyebrow="What we value" title="How we work" />
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {VALUES.map((v) => (
              <li key={v.title} className="flex flex-col gap-2 rounded-xl border border-border bg-card p-6">
                <h3 className="font-heading text-lg font-semibold text-foreground">{v.title}</h3>
                <p className="leading-relaxed text-muted-foreground">{v.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="pt-20 sm:pt-24">
        <CtaBand />
      </div>
    </>
  )
}
