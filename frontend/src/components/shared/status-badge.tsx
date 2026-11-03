import {
  CircleCheck,
  CircleDashed,
  CirclePlay,
  CircleSlash,
  OctagonAlert,
  type LucideIcon,
} from 'lucide-react'
import type { ProjectStatus } from '@/domain/models'
import { STATUS_LABELS } from '@/lib/labels'
import { cn } from '@/lib/utils'

const STATUS_STYLES: Record<
  ProjectStatus,
  { icon: LucideIcon; className: string }
> = {
  planned: {
    icon: CircleDashed,
    className: 'border-border bg-sand-soft text-muted-foreground',
  },
  in_progress: {
    icon: CirclePlay,
    className:
      'border-brand-terracotta/25 bg-brand-terracotta-subtle text-brand-terracotta-hover',
  },
  on_hold: {
    icon: OctagonAlert,
    className: 'border-warning/20 bg-warning-soft text-warning',
  },
  completed: {
    icon: CircleCheck,
    className: 'border-success/20 bg-success-soft text-success',
  },
  cancelled: {
    icon: CircleSlash,
    className: 'border-border bg-muted text-muted-foreground',
  },
}

interface StatusBadgeProps {
  status: ProjectStatus
  className?: string
  showIcon?: boolean
}

export function StatusBadge({
  status,
  className,
  showIcon = true,
}: StatusBadgeProps) {
  const config = STATUS_STYLES[status]
  const Icon = config.icon

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap',
        config.className,
        className,
      )}
    >
      {showIcon ? <Icon aria-hidden="true" className="size-3.5" /> : null}
      {STATUS_LABELS[status]}
    </span>
  )
}
