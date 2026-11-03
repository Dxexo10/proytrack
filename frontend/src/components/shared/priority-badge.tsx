import type { ProjectPriority } from '@/domain/models'
import { PRIORITY_LABELS } from '@/lib/labels'
import { cn } from '@/lib/utils'

const PRIORITY_STYLES: Record<ProjectPriority, string> = {
  low: 'text-slate-500',
  medium: 'text-blue-600',
  high: 'text-amber-600',
  critical: 'text-red-600',
}

const DOT_STYLES: Record<ProjectPriority, string> = {
  low: 'bg-slate-400',
  medium: 'bg-blue-500',
  high: 'bg-amber-500',
  critical: 'bg-red-500',
}

interface PriorityBadgeProps {
  priority: ProjectPriority
  className?: string
}

export function PriorityBadge({ priority, className }: PriorityBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 text-xs font-medium',
        PRIORITY_STYLES[priority],
        className,
      )}
    >
      <span
        aria-hidden="true"
        className={cn('size-1.5 rounded-full', DOT_STYLES[priority])}
      />
      {PRIORITY_LABELS[priority]}
    </span>
  )
}
