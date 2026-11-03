import { clamp } from '@/domain/utils/format'
import { cn } from '@/lib/utils'

interface ProgressBarProps {
  value: number
  className?: string
  showLabel?: boolean
  label?: string
}

export function ProgressBar({
  value,
  className,
  showLabel = false,
  label = 'Avance del proyecto',
}: ProgressBarProps) {
  const safeValue = clamp(Math.round(value), 0, 100)

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={safeValue}
      aria-label={label}
      className={cn('flex items-center gap-3', className)}
    >
      <div className="h-1.5 min-w-16 flex-1 overflow-hidden rounded-full bg-muted">
        <div
          className={cn(
            'h-full rounded-full transition-[width] duration-300',
            safeValue === 100 ? 'bg-brand-olive' : 'bg-brand-terracotta',
          )}
          style={{ width: `${safeValue}%` }}
        />
      </div>
      {showLabel ? (
        <span className="w-9 shrink-0 text-right text-xs font-medium tabular-nums text-muted-foreground">
          {safeValue}%
        </span>
      ) : null}
    </div>
  )
}
