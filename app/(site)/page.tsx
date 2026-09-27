import { Hero } from '@/components/site/home/hero'
import { ServicesOverview } from '@/components/site/home/services-overview'
import { WhyUs } from '@/components/site/home/why-us'
import { CtaBand } from '@/components/site/cta-band'

export default function HomePage() {
  return (
    <>
      <Hero />
      <ServicesOverview />
      <WhyUs />
      <CtaBand />
    </>
  )
}
