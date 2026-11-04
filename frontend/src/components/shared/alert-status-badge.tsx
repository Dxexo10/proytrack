import type { AlertStatus } from '@/domain/models'
import { ALERT_STATUS_LABELS } from '@/lib/labels'
import { cn } from '@/lib/utils'

const STATUS_STYLES: Record<AlertStatus, string> = {
  open: 'border-warning/20 bg-warning-soft text-warning',
  reviewed: 'border-info/20 bg-info-soft text-info',
  resolved: 'border-success/20 bg-success-soft text-success',
}

interface AlertStatusBadgeProps {
  status: AlertStatus
  className?: string
}

export function AlertStatusBadge({ status, className }: AlertStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium whitespace-nowrap',
        STATUS_STYLES[status],
        className,
      )}
    >
      {ALERT_STATUS_LABELS[status]}
    </span>
  )
}
