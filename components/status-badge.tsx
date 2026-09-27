import { Badge } from '@/components/ui/badge'
import { STATUS_LABELS, type ShipmentStatusValue } from '@/lib/constants'
import { cn } from '@/lib/utils'

const TONE: Record<ShipmentStatusValue, { variant: 'default' | 'secondary' | 'destructive' | 'outline'; dot: string }> = {
  PENDING: { variant: 'outline', dot: 'bg-muted-foreground' },
  PROCESSING: { variant: 'secondary', dot: 'bg-ring' },
  IN_TRANSIT: { variant: 'secondary', dot: 'bg-brand' },
  ON_HOLD: { variant: 'destructive', dot: 'bg-destructive' },
  OUT_FOR_DELIVERY: { variant: 'secondary', dot: 'bg-brand' },
  DELIVERED: { variant: 'default', dot: 'bg-brand' },
  CANCELLED: { variant: 'destructive', dot: 'bg-destructive' },
}

export function StatusBadge({ status, className }: { status: ShipmentStatusValue; className?: string }) {
  const tone = TONE[status]
  return (
    <Badge variant={tone.variant} className={cn('gap-1.5', className)}>
      <span aria-hidden="true" className={cn('size-1.5 rounded-full', tone.dot)} />
      {STATUS_LABELS[status]}
    </Badge>
  )
}
