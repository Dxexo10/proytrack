import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react'
import { formatPercentage } from '@/domain/utils/money'
import { cn } from '@/lib/utils'

interface MetricDeltaProps {
  value: number | null
  label: string
  lowerIsBetter?: boolean
  className?: string
  onDark?: boolean
}

export function MetricDelta({
  value,
  label,
  lowerIsBetter = false,
  className,
  onDark = false,
}: MetricDeltaProps) {
  if (value === null || Number.isNaN(value)) {
    return (
      <p
        className={cn(
          'text-xs',
          onDark ? 'text-brand-ivory/60' : 'text-muted-foreground',
          className,
        )}
      >
        {label}
      </p>
    )
  }

  const isFlat = Math.abs(value) < 0.05
  const isPositive = lowerIsBetter ? value < 0 : value > 0
  const Icon = isFlat ? ArrowRight : value > 0 ? ArrowUpRight : ArrowDownRight

  return (
    <p className={cn('flex items-center gap-1.5 text-xs', className)}>
      <span
        className={cn(
          'inline-flex items-center gap-0.5 rounded-md px-1 py-0.5 font-medium tabular-nums',
          onDark
            ? isFlat
              ? 'text-brand-ivory/70'
              : isPositive
                ? 'text-[#BFD3B8]'
                : 'text-[#F0B6A6]'
            : isFlat
              ? 'bg-muted text-muted-foreground'
              : isPositive
                ? 'bg-success-soft text-success'
                : 'bg-danger-soft text-danger',
        )}
      >
        <Icon aria-hidden="true" className="size-3" />
        {formatPercentage(value)}
      </span>
      <span
        className={cn(onDark ? 'text-brand-ivory/60' : 'text-muted-foreground')}
      >
        {label}
      </span>
    </p>
  )
}
