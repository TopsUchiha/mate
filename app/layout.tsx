import type { Metadata, Viewport } from 'next'
import { Inter, Montserrat } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import { COMPANY, SITE_URL } from '@/lib/constants'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['600', '700', '800'],
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${COMPANY.name} | Global Freight, Shipping & Tracking`,
    template: `%s | ${COMPANY.name}`,
  },
  description:
    'Vantage Logistics delivers air freight, ocean freight, domestic shipping, warehousing, customs clearance and e-commerce fulfillment from Sunbury, Ohio to the world. Track your shipment online.',
  applicationName: COMPANY.name,
  openGraph: {
    type: 'website',
    siteName: COMPANY.name,
    locale: 'en_US',
    images: [{ url: '/images/hero-port.png', width: 1200, height: 630, alt: 'Vantage Logistics container port' }],
  },
  twitter: { card: 'summary_large_image' },
}

export const viewport: Viewport = {
  themeColor: '#1b365d',
  colorScheme: 'light',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${montserrat.variable}`}>
      <body className="antialiased">
        {children}
        <Toaster richColors position="top-right" />
      </body>
    </html>
  )
}
