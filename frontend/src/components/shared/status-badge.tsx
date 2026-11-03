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
    className: 'border-slate-200 bg-slate-50 text-slate-600',
  },
  in_progress: {
    icon: CirclePlay,
    className: 'border-blue-200 bg-blue-50 text-blue-700',
  },
  on_hold: {
    icon: OctagonAlert,
    className: 'border-amber-200 bg-amber-50 text-amber-700',
  },
  completed: {
    icon: CircleCheck,
    className: 'border-emerald-200 bg-emerald-50 text-emerald-700',
  },
  cancelled: {
    icon: CircleSlash,
    className: 'border-slate-200 bg-slate-100 text-slate-500',
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
