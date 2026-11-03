import { ArrowDownRight, ArrowRight, ArrowUpRight } from 'lucide-react'
import { formatPercentage } from '@/domain/utils/money'
import { cn } from '@/lib/utils'

interface MetricDeltaProps {
  value: number | null
  label: string
  lowerIsBetter?: boolean
  className?: string
}

export function MetricDelta({
  value,
  label,
  lowerIsBetter = false,
  className,
}: MetricDeltaProps) {
  if (value === null || Number.isNaN(value)) {
    return (
      <p className={cn('text-xs text-muted-foreground', className)}>{label}</p>
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
          isFlat
            ? 'bg-slate-100 text-slate-600'
            : isPositive
              ? 'bg-emerald-50 text-emerald-700'
              : 'bg-red-50 text-red-700',
        )}
      >
        <Icon aria-hidden="true" className="size-3" />
        {formatPercentage(value)}
      </span>
      <span className="text-muted-foreground">{label}</span>
    </p>
  )
}
