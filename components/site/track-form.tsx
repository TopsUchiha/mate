'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Spinner } from '@/components/ui/spinner'
import { TRACKING_NUMBER_REGEX } from '@/lib/constants'
import { cn } from '@/lib/utils'

export function TrackForm({
  defaultValue = '',
  size = 'default',
  className,
}: {
  defaultValue?: string
  size?: 'default' | 'hero'
  className?: string
}) {
  const router = useRouter()
  const [value, setValue] = useState(defaultValue)
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const normalized = value.trim().toUpperCase()
    if (!normalized) return setError('Please enter a tracking number.')
    if (!TRACKING_NUMBER_REGEX.test(normalized)) {
      return setError('Tracking numbers look like VGL-8291047.')
    }
    setError(null)
    startTransition(() => router.push(`/track?number=${encodeURIComponent(normalized)}`))
  }

  const hero = size === 'hero'
  return (
    <form onSubmit={onSubmit} noValidate className={cn('flex w-full flex-col gap-2', className)} role="search">
      <label htmlFor="tracking-number" className="sr-only">
        Tracking number
      </label>
      <div className={cn('flex w-full gap-2', hero && 'rounded-xl bg-card p-2 shadow-xl ring-1 ring-border')}>
        <Input
          id="tracking-number"
          name="number"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter tracking number, e.g. VGL-8291047"
          autoComplete="off"
          spellCheck={false}
          aria-invalid={!!error}
          aria-describedby={error ? 'tracking-error' : undefined}
          className={cn('font-mono tracking-wide uppercase placeholder:font-sans placeholder:tracking-normal placeholder:normal-case', hero ? 'h-12 border-0 text-base shadow-none focus-visible:ring-0' : 'h-10')}
        />
        <Button type="submit" disabled={pending} className={cn(hero ? 'h-12 px-5 text-base' : 'h-10 px-4')}>
          {pending ? <Spinner data-icon="inline-start" /> : <Search data-icon="inline-start" />}
          Track
        </Button>
      </div>
      {error && (
        <p id="tracking-error" role="alert" className={cn('text-sm text-destructive', hero && 'rounded-md bg-card px-3 py-1.5')}>
          {error}
        </p>
      )}
    </form>
  )
}
