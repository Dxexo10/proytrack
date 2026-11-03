import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { MetricDelta } from './metric-delta'

type KpiTone = 'default' | 'positive' | 'warning' | 'danger' | 'info'

const TONE_STYLES: Record<KpiTone, string> = {
  default: 'bg-slate-50 text-slate-600 ring-slate-200/70',
  positive: 'bg-emerald-50 text-emerald-600 ring-emerald-200/70',
  warning: 'bg-amber-50 text-amber-600 ring-amber-200/70',
  danger: 'bg-red-50 text-red-600 ring-red-200/70',
  info: 'bg-blue-50 text-blue-600 ring-blue-200/70',
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
    <Card className="h-full gap-4 p-5 transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-[0_18px_38px_-26px_rgba(15,23,42,0.45)]">
      <div className="flex items-start justify-between gap-3 px-0">
        <p className="pt-0.5 text-[11px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
          {label}
        </p>
        <span
          aria-hidden="true"
          className={cn(
            'inline-flex size-9 items-center justify-center rounded-xl ring-1 ring-inset',
            TONE_STYLES[tone],
          )}
        >
          <Icon className="size-4" />
        </span>
      </div>
      <p className="px-0 text-[30px] leading-none font-semibold tracking-[-0.02em] text-foreground tabular-nums">
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
      className="block h-full rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
      aria-label={`${label}: ${value}. Ver detalle`}
    >
      {content}
    </Link>
  )
}
