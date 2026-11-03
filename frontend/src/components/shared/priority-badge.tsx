import type { ProjectPriority } from '@/domain/models'
import { PRIORITY_LABELS } from '@/lib/labels'
import { cn } from '@/lib/utils'

const PRIORITY_STYLES: Record<ProjectPriority, string> = {
  low: 'text-muted-foreground',
  medium: 'text-info',
  high: 'text-warning',
  critical: 'text-danger',
}

const DOT_STYLES: Record<ProjectPriority, string> = {
  low: 'bg-text-muted',
  medium: 'bg-info',
  high: 'bg-warning',
  critical: 'bg-danger',
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
