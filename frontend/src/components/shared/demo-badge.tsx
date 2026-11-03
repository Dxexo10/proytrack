import { DEMO_LABEL } from '@/lib/demo-config'
import { cn } from '@/lib/utils'

interface DemoBadgeProps {
  variant?: 'light' | 'dark'
  className?: string
}

export function DemoBadge({ variant = 'light', className }: DemoBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium leading-tight',
        variant === 'light'
          ? 'border border-amber-200 bg-amber-50 text-amber-800'
          : 'border border-amber-400/20 bg-amber-400/10 text-amber-200',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="size-1.5 shrink-0 rounded-full bg-amber-500"
      />
      {DEMO_LABEL}
    </span>
  )
}
