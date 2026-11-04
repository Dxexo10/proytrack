import {
  BellRing,
  CircleCheck,
  Eye,
  OctagonAlert,
  type LucideIcon,
} from 'lucide-react'
import { Card } from '@/components/ui/card'
import type { AlertCounts } from '../hooks/use-alerts-query'

const CARDS: {
  key: keyof AlertCounts
  label: string
  icon: LucideIcon
  className: string
}[] = [
  {
    key: 'open',
    label: 'Abiertas',
    icon: BellRing,
    className: 'bg-brand-terracotta-subtle text-brand-terracotta-hover',
  },
  {
    key: 'critical',
    label: 'Críticas abiertas',
    icon: OctagonAlert,
    className: 'bg-danger-soft text-danger',
  },
  {
    key: 'reviewed',
    label: 'Revisadas',
    icon: Eye,
    className: 'bg-info-soft text-info',
  },
  {
    key: 'resolved',
    label: 'Resueltas',
    icon: CircleCheck,
    className: 'bg-success-soft text-success',
  },
]

interface AlertCountersProps {
  counts: AlertCounts
}

export function AlertCounters({ counts }: AlertCountersProps) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {CARDS.map((card) => {
        const Icon = card.icon

        return (
          <Card key={card.key} className="gap-2 p-4">
            <div className="flex items-center justify-between gap-2">
              <p className="text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
                {card.label}
              </p>
              <span
                aria-hidden="true"
                className={`inline-flex size-8 items-center justify-center rounded-lg ${card.className}`}
              >
                <Icon className="size-4" />
              </span>
            </div>
            <p className="text-2xl font-semibold tabular-nums text-foreground">
              {counts[card.key]}
            </p>
          </Card>
        )
      })}
    </div>
  )
}
