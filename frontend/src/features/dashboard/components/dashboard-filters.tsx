import type { DashboardPeriod } from '@/domain/services/dashboard-summary'
import { cn } from '@/lib/utils'
import { PERIODS } from '../hooks/use-dashboard-filters'

interface DashboardFiltersProps {
  period: DashboardPeriod
  onChange: (period: DashboardPeriod) => void
}

export function DashboardFilters({ period, onChange }: DashboardFiltersProps) {
  return (
    <fieldset className="inline-flex items-center gap-1 rounded-lg border border-border bg-surface p-1">
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
              'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
              active
                ? 'bg-brand-navy text-white'
                : 'text-muted-foreground hover:bg-muted hover:text-foreground',
            )}
          >
            {option} meses
          </button>
        )
      })}
    </fieldset>
  )
}
