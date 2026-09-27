import Link from 'next/link'
import { Button } from '@/components/ui/button'

export function CtaBand() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 sm:pb-24 lg:px-8">
      <div className="flex flex-col items-start justify-between gap-6 rounded-2xl bg-navy px-6 py-12 text-navy-foreground sm:px-12 md:flex-row md:items-center">
        <div className="flex max-w-xl flex-col gap-2">
          <h2 className="font-heading text-2xl font-bold text-balance sm:text-3xl">Ready to ship with Vantage?</h2>
          <p className="text-navy-foreground/75">Tell us about your cargo and we&apos;ll get back to you within one business day.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button size="lg" className="bg-brand text-brand-foreground hover:bg-brand/90" nativeButton={false} render={<Link href="/contact" />}>
            Request a quote
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="border-navy-foreground/30 bg-transparent text-navy-foreground hover:bg-navy-foreground/10 hover:text-navy-foreground"
            nativeButton={false}
            render={<Link href="/track" />}
          >
            Track a shipment
          </Button>
        </div>
      </div>
    </section>
  )
}
