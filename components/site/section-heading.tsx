import { cn } from '@/lib/utils'

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = 'left',
  className,
}: {
  eyebrow: string
  title: string
  description?: string
  align?: 'left' | 'center'
  className?: string
}) {
  return (
    <div className={cn('flex max-w-2xl flex-col gap-3', align === 'center' && 'mx-auto items-center text-center', className)}>
      <p className="text-sm font-semibold tracking-widest text-accent-foreground uppercase">{eyebrow}</p>
      <h2 className="font-heading text-3xl font-bold text-balance text-foreground sm:text-4xl">{title}</h2>
      {description && <p className="text-lg leading-relaxed text-pretty text-muted-foreground">{description}</p>}
    </div>
  )
}

export function PageHero({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <section className="border-b border-border bg-secondary">
      <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-14 sm:px-6 sm:py-20 lg:px-8">
        <p className="text-sm font-semibold tracking-widest text-accent-foreground uppercase">{eyebrow}</p>
        <h1 className="max-w-3xl font-heading text-4xl font-bold text-balance text-foreground sm:text-5xl">{title}</h1>
        <p className="max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground">{description}</p>
      </div>
    </section>
  )
}
