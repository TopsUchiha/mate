import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { SectionHeading } from '@/components/site/section-heading'
import { SERVICES } from '@/lib/site-content'

export function ServicesOverview() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading
          eyebrow="What we move"
          title="One partner for every leg of the journey"
          description="From a single envelope to a full container, we plan the route, handle the paperwork and keep you updated."
        />
        <Link href="/services" className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-primary hover:underline">
          All services
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      </div>

      <ul className="mt-12 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((service) => (
          <li key={service.slug} className="group flex flex-col gap-4 bg-card p-6 transition-colors hover:bg-secondary">
            <span className="flex size-11 items-center justify-center rounded-lg bg-accent text-accent-foreground">
              <service.icon aria-hidden="true" className="size-5" />
            </span>
            <h3 className="font-heading text-lg font-semibold text-foreground">{service.title}</h3>
            <p className="text-sm leading-relaxed text-muted-foreground">{service.summary}</p>
          </li>
        ))}
        <li className="flex flex-col justify-between gap-4 bg-primary p-6 text-primary-foreground">
          <h3 className="font-heading text-lg font-semibold">Not sure what you need?</h3>
          <p className="text-sm leading-relaxed text-primary-foreground/80">
            Tell us what you&apos;re shipping and where. We&apos;ll recommend the fastest, most cost-effective route.
          </p>
          <Link href="/contact" className="inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline">
            Talk to a specialist
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </li>
      </ul>
    </section>
  )
}
