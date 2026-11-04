import { FilterX } from 'lucide-react'
import {
  FilterSelect,
  type FilterOption,
} from '@/components/shared/filter-select'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  ALERT_SEVERITIES,
  ALERT_STATUSES,
  type AlertSeverity,
  type AlertStatus,
  type Project,
} from '@/domain/models'
import { ALERT_STATUS_LABELS, SEVERITY_LABELS } from '@/lib/labels'
import {
  ALERT_PERIODS,
  hasActiveAlertFilters,
  type AlertFilters as AlertFiltersState,
} from '../hooks/use-alert-filters'

const ALL: FilterOption = { value: 'all', label: 'Todos' }

const STATUS_OPTIONS: FilterOption[] = [
  ALL,
  ...ALERT_STATUSES.map((status) => ({
    value: status,
    label: ALERT_STATUS_LABELS[status],
  })),
]

const SEVERITY_OPTIONS: FilterOption[] = [
  ALL,
  ...ALERT_SEVERITIES.map((severity) => ({
    value: severity,
    label: SEVERITY_LABELS[severity],
  })),
]

const PERIOD_LABELS: Record<(typeof ALERT_PERIODS)[number], string> = {
  '30': 'Últimos 30 días',
  '90': 'Últimos 90 días',
  '365': 'Últimos 12 meses',
  all: 'Todo el historial',
}

const PERIOD_OPTIONS: FilterOption[] = ALERT_PERIODS.map((period) => ({
  value: period,
  label: PERIOD_LABELS[period],
}))

interface AlertsFiltersProps {
  filters: AlertFiltersState
  projects: readonly Project[]
  onChange: (patch: Partial<AlertFiltersState>) => void
  onClear: () => void
}

export function AlertsFilters({
  filters,
  projects,
  onChange,
  onClear,
}: AlertsFiltersProps) {
  const projectOptions: FilterOption[] = [
    { value: 'all', label: 'Todos los proyectos' },
    ...projects.map((project) => ({
      value: project.id,
      label: `${project.code} · ${project.name}`,
    })),
  ]

  const active = hasActiveAlertFilters(filters)

  return (
    <Card className="gap-3 p-4 sm:p-5">
      <div className="grid gap-3 sm:grid-cols-2 xl:flex xl:flex-wrap xl:items-end">
        <FilterSelect
          label="Estado"
          value={filters.status}
          options={STATUS_OPTIONS}
          onChange={(status) =>
            onChange({ status: status as AlertStatus | 'all' })
          }
          className="xl:w-[150px]"
        />
        <FilterSelect
          label="Severidad"
          value={filters.severity}
          options={SEVERITY_OPTIONS}
          onChange={(severity) =>
            onChange({ severity: severity as AlertSeverity | 'all' })
          }
          className="xl:w-[150px]"
        />
        <FilterSelect
          label="Proyecto"
          value={filters.projectId || 'all'}
          options={projectOptions}
          onChange={(projectId) =>
            onChange({ projectId: projectId === 'all' ? '' : projectId })
          }
          className="xl:w-[240px]"
        />
        <FilterSelect
          label="Periodo"
          value={filters.period}
          options={PERIOD_OPTIONS}
          onChange={(period) =>
            onChange({ period: period as AlertFiltersState['period'] })
          }
          className="xl:w-[170px]"
        />
      </div>

      {active ? (
        <div className="flex items-center justify-end border-t border-border/60 pt-3">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="gap-1.5 text-brand-terracotta-hover"
          >
            <FilterX aria-hidden="true" className="size-3.5" />
            Limpiar filtros
          </Button>
        </div>
      ) : null}
    </Card>
  )
}
