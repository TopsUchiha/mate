import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { TrackForm } from '@/components/site/track-form'

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-navy text-navy-foreground">
      <Image
        src="/images/hero-port.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="-z-10 object-cover opacity-45"
      />
      <div aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-r from-navy via-navy/85 to-navy/30" />

      <div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-20 sm:px-6 sm:py-28 lg:px-8 lg:py-36">
        <div className="flex max-w-2xl flex-col gap-6">
          <p className="flex items-center gap-2 text-sm font-semibold tracking-widest text-brand uppercase">
            <span aria-hidden="true" className="h-px w-8 bg-brand" />
            Global freight from Sunbury, Ohio
          </p>
          <h1 className="font-heading text-4xl leading-tight font-bold text-balance sm:text-5xl lg:text-6xl">
            Freight that arrives with <span className="text-brand">vantage</span>.
          </h1>
          <p className="max-w-xl text-lg leading-relaxed text-pretty text-navy-foreground/80">
            Air, ocean and ground logistics managed end-to-end — with live shipment tracking so you always know
            where your cargo is and when it lands.
          </p>
        </div>

        <div className="flex max-w-xl flex-col gap-4">
          <TrackForm size="hero" />
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
            <Link href="/contact" className="inline-flex items-center gap-1.5 font-medium text-navy-foreground hover:text-brand">
              Request a quote
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
            <Link href="/services" className="text-navy-foreground/70 hover:text-navy-foreground">
              Explore our services
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export function HeroCtaButton() {
  return (
    <Button size="lg" nativeButton={false} render={<Link href="/contact" />}>
      Get a quote
    </Button>
  )
}
