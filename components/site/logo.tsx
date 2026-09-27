import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export function Logo({ className, href = '/', priority }: { className?: string; href?: string; priority?: boolean }) {
  return (
    <Link href={href} className={cn('inline-flex shrink-0 items-center', className)} aria-label="Vantage Logistics home">
      <Image
        src="/images/logo-mark.png"
        alt="Vantage Logistics"
        width={467}
        height={149}
        priority={priority}
        className="h-10 w-auto sm:h-11"
      />
    </Link>
  )
}
