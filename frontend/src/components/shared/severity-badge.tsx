import {
  Info,
  OctagonAlert,
  TriangleAlert,
  type LucideIcon,
} from 'lucide-react'
import type { AlertSeverity } from '@/domain/models'
import { SEVERITY_LABELS } from '@/lib/labels'
import { cn } from '@/lib/utils'

const SEVERITY_STYLES: Record<
  AlertSeverity,
  { icon: LucideIcon; className: string }
> = {
  critical: {
    icon: OctagonAlert,
    className: 'border-danger/20 bg-danger-soft text-danger',
  },
  warning: {
    icon: TriangleAlert,
    className: 'border-warning/20 bg-warning-soft text-warning',
  },
  info: {
    icon: Info,
    className: 'border-info/20 bg-info-soft text-info',
  },
}

interface SeverityBadgeProps {
  severity: AlertSeverity
  showLabel?: boolean
  className?: string
}

export function SeverityBadge({
  severity,
  showLabel = true,
  className,
}: SeverityBadgeProps) {
  const { icon: Icon, className: style } = SEVERITY_STYLES[severity]

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border text-xs font-medium whitespace-nowrap',
        showLabel
          ? 'px-2 py-0.5'
          : 'size-6 shrink-0 justify-center self-start p-0',
        style,
        className,
      )}
    >
      <Icon aria-hidden="true" className="size-3.5" />
      {showLabel ? (
        SEVERITY_LABELS[severity]
      ) : (
        <span className="sr-only">{SEVERITY_LABELS[severity]}</span>
      )}
    </span>
  )
}
