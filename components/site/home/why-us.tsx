import Image from 'next/image'
import { CircleCheck } from 'lucide-react'
import { SectionHeading } from '@/components/site/section-heading'

const POINTS = [
  { title: 'Real-time visibility', body: 'Every checkpoint is logged and viewable online, from pickup to proof of delivery.' },
  { title: 'Customs handled for you', body: 'Our brokerage team prepares filings and classifications so borders never slow you down.' },
  { title: 'A single point of contact', body: 'One coordinator owns your shipment across every carrier, port and warehouse.' },
  { title: 'Flexible capacity', body: 'Scale from one-off parcels to recurring containers without renegotiating every lane.' },
]

const STEPS = [
  { n: '01', title: 'Book', body: 'Share your cargo details and timeline. We quote and confirm routing within one business day.' },
  { n: '02', title: 'Move', body: 'We collect, consolidate and ship by air, ocean or road, handling customs along the way.' },
  { n: '03', title: 'Track', body: 'Follow every milestone with your tracking number until your shipment is delivered.' },
]

export function WhyUs() {
  return (
    <>
      <section className="bg-secondary">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-20 sm:px-6 sm:py-24 lg:grid-cols-2 lg:px-8">
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl">
            <Image
              src="/images/warehouse.png"
              alt="Organized Vantage Logistics warehouse with pallets and forklifts"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col gap-8">
            <SectionHeading
              eyebrow="Why Vantage"
              title="Logistics you don't have to chase"
              description="We built Vantage around one idea: you should always know where your freight is — without picking up the phone."
            />
            <ul className="grid gap-6 sm:grid-cols-2">
              {POINTS.map((p) => (
                <li key={p.title} className="flex gap-3">
                  <CircleCheck aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-brand" />
                  <div className="flex flex-col gap-1">
                    <h3 className="font-semibold text-foreground">{p.title}</h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">{p.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <SectionHeading eyebrow="How it works" title="Three steps from quote to doorstep" align="center" />
        <ol className="mt-12 grid gap-8 md:grid-cols-3">
          {STEPS.map((s) => (
            <li key={s.n} className="flex flex-col gap-3 border-t-2 border-brand pt-6">
              <span className="font-heading text-sm font-bold text-accent-foreground">{s.n}</span>
              <h3 className="font-heading text-xl font-semibold text-foreground">{s.title}</h3>
              <p className="leading-relaxed text-muted-foreground">{s.body}</p>
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}
