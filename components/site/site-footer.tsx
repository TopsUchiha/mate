import Image from 'next/image'
import Link from 'next/link'
import { Mail, MapPin } from 'lucide-react'
import { COMPANY } from '@/lib/constants'
import { NAV_LINKS, SERVICES } from '@/lib/site-content'

export function SiteFooter() {
  return (
    <footer className="bg-navy text-navy-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div className="flex flex-col gap-4">
          <div className="w-fit rounded-lg bg-white px-3 py-2">
            <Image src="/images/logo-mark.png" alt="Vantage Logistics" width={467} height={149} className="h-9 w-auto" />
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-navy-foreground/70">
            Freight forwarding, warehousing and shipment visibility for businesses that can&apos;t afford to wait.
          </p>
        </div>

        <FooterColumn title="Company">
          {NAV_LINKS.map((l) => (
            <FooterLink key={l.href} href={l.href}>
              {l.label}
            </FooterLink>
          ))}
        </FooterColumn>

        <FooterColumn title="Services">
          {SERVICES.slice(0, 6).map((s) => (
            <FooterLink key={s.slug} href={`/services#${s.slug}`}>
              {s.title}
            </FooterLink>
          ))}
        </FooterColumn>

        <FooterColumn title="Contact">
          <li className="flex items-start gap-2 text-sm text-navy-foreground/80">
            <MapPin aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand" />
            {COMPANY.location}
          </li>
          <li className="flex items-start gap-2 text-sm">
            <Mail aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-brand" />
            <a href={`mailto:${COMPANY.email}`} className="text-navy-foreground/80 hover:text-navy-foreground">
              {COMPANY.email}
            </a>
          </li>
        </FooterColumn>
      </div>
      <div className="border-t border-navy-foreground/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-6 text-xs text-navy-foreground/60 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>
            {'© '}
            {new Date().getFullYear()} {COMPANY.name}. All rights reserved.
          </p>
          <div className="flex gap-5">
            <Link href="/privacy" className="hover:text-navy-foreground">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-navy-foreground">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterColumn({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-heading text-sm font-semibold tracking-wide uppercase">{title}</h2>
      <ul className="flex flex-col gap-2.5">{children}</ul>
    </div>
  )
}

function FooterLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <li>
      <Link href={href} className="text-sm text-navy-foreground/80 transition-colors hover:text-navy-foreground">
        {children}
      </Link>
    </li>
  )
}
