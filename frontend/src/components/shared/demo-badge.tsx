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
          ? 'border border-brand-terracotta/20 bg-brand-terracotta-subtle text-brand-terracotta-hover'
          : 'border border-white/15 bg-white/10 text-brand-ivory',
        className,
      )}
    >
      <span
        aria-hidden="true"
        className="size-1.5 shrink-0 rounded-full bg-brand-terracotta"
      />
      {DEMO_LABEL}
    </span>
  )
}
