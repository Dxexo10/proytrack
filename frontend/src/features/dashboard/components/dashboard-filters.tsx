import type { DashboardPeriod } from '@/domain/services/dashboard-summary'
import { cn } from '@/lib/utils'
import { PERIODS } from '../hooks/use-dashboard-filters'

interface DashboardFiltersProps {
  period: DashboardPeriod
  onChange: (period: DashboardPeriod) => void
}

export function DashboardFilters({ period, onChange }: DashboardFiltersProps) {
  return (
    <fieldset className="inline-flex items-center gap-1 rounded-xl border border-border/80 bg-canvas/80 p-1">
      <legend className="sr-only">Periodo del resumen</legend>
      {PERIODS.map((option) => {
        const active = option === period

        return (
          <button
            key={option}
            type="button"
            onClick={() => onChange(option)}
            aria-pressed={active}
            className={cn(
              'rounded-lg px-3 py-1 text-xs font-medium transition-colors duration-150',
              active
                ? 'bg-brand-terracotta-strong text-white shadow-[0_4px_10px_-6px_rgba(198,93,58,0.8)]'
                : 'text-muted-foreground hover:bg-surface hover:text-foreground',
            )}
          >
            {option} meses
          </button>
        )
      })}
    </fieldset>
  )
}
