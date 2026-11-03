import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { MetricDelta } from './metric-delta'

type KpiTone = 'default' | 'positive' | 'warning' | 'danger' | 'info'

const TONE_STYLES: Record<KpiTone, string> = {
  default: 'bg-slate-100 text-slate-600',
  positive: 'bg-emerald-50 text-emerald-600',
  warning: 'bg-amber-50 text-amber-600',
  danger: 'bg-red-50 text-red-600',
  info: 'bg-blue-50 text-blue-600',
}

interface KpiCardProps {
  label: string
  value: string
  icon: LucideIcon
  tone?: KpiTone
  delta?: number | null
  deltaLabel?: string
  lowerIsBetter?: boolean
  href?: string
  hint?: string
}

export function KpiCard({
  label,
  value,
  icon: Icon,
  tone = 'default',
  delta,
  deltaLabel = 'vs. periodo anterior',
  lowerIsBetter = false,
  href,
  hint,
}: KpiCardProps) {
  const content = (
    <Card className="h-full gap-3 p-5 transition-colors hover:ring-foreground/20">
      <div className="flex items-start justify-between gap-3 px-0">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <span
          aria-hidden="true"
          className={cn(
            'inline-flex size-8 items-center justify-center rounded-lg',
            TONE_STYLES[tone],
          )}
        >
          <Icon className="size-4" />
        </span>
      </div>
      <p className="px-0 text-[28px] leading-none font-semibold tracking-tight text-foreground tabular-nums">
        {value}
      </p>
      <div className="px-0">
        {delta !== undefined ? (
          <MetricDelta
            value={delta}
            label={deltaLabel}
            lowerIsBetter={lowerIsBetter}
          />
        ) : (
          <p className="text-xs text-muted-foreground">{hint}</p>
        )}
      </div>
    </Card>
  )

  if (!href) return content

  return (
    <Link
      to={href}
      className="block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      aria-label={`${label}: ${value}. Ver detalle`}
    >
      {content}
    </Link>
  )
}
