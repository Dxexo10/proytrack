import type { LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { MetricDelta } from './metric-delta'

type KpiTone = 'default' | 'positive' | 'warning' | 'danger' | 'info'

const TONE_STYLES: Record<KpiTone, string> = {
  default: 'bg-sand-soft text-text-secondary ring-border',
  positive: 'bg-success-soft text-success ring-success/15',
  warning: 'bg-warning-soft text-warning ring-warning/15',
  danger: 'bg-danger-soft text-danger ring-danger/15',
  info: 'bg-info-soft text-info ring-info/15',
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
  featured?: boolean
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
  featured = false,
}: KpiCardProps) {
  const content = (
    <Card
      className={cn(
        'h-full gap-4 p-5 transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-raised',
        featured &&
          'bg-brand-graphite bg-[image:radial-gradient(120%_120%_at_100%_0%,rgba(198,93,58,0.22),transparent_60%)] text-brand-ivory shadow-[0_20px_50px_-30px_rgba(37,40,36,0.65)] ring-0',
      )}
    >
      <div className="flex items-start justify-between gap-3 px-0">
        <p
          className={cn(
            'pt-0.5 text-[11px] font-semibold tracking-[0.12em] uppercase',
            featured ? 'text-brand-ivory/70' : 'text-muted-foreground',
          )}
        >
          {label}
        </p>
        <span
          aria-hidden="true"
          className={cn(
            'inline-flex size-9 items-center justify-center rounded-xl ring-1 ring-inset',
            featured
              ? 'bg-brand-terracotta text-white ring-brand-terracotta/40'
              : TONE_STYLES[tone],
          )}
        >
          <Icon className="size-4" />
        </span>
      </div>
      <p
        className={cn(
          'px-0 text-[32px] leading-none font-semibold tracking-[-0.02em] tabular-nums',
          featured ? 'text-brand-ivory' : 'text-foreground',
        )}
      >
        {value}
      </p>
      <div className="px-0">
        {delta !== undefined ? (
          <MetricDelta
            value={delta}
            label={deltaLabel}
            lowerIsBetter={lowerIsBetter}
            onDark={featured}
          />
        ) : (
          <p
            className={cn(
              'text-xs',
              featured ? 'text-brand-ivory/60' : 'text-muted-foreground',
            )}
          >
            {hint}
          </p>
        )}
      </div>
    </Card>
  )

  if (!href) return content

  return (
    <Link
      to={href}
      className="block h-full rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      {content}
      <span className="sr-only">Ver detalle</span>
    </Link>
  )
}
