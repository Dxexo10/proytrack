import { FilterX } from 'lucide-react'
import {
  FilterSelect,
  type FilterOption,
} from '@/components/shared/filter-select'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  CHANGE_TYPES,
  type AlertSeverity,
  type ChangeType,
  type Project,
  type VersionSource,
} from '@/domain/models'
import {
  CHANGE_FIELD_LABELS,
  SEVERITY_LABELS,
  SOURCE_LABELS,
} from '@/lib/labels'
import {
  hasActiveMonitorFilters,
  MONITOR_PERIODS,
  type MonitorFilters as MonitorFiltersState,
} from '../hooks/use-monitor-filters'

const ALL: FilterOption = { value: 'all', label: 'Todos' }

const FIELD_OPTIONS: FilterOption[] = [
  ALL,
  ...CHANGE_TYPES.map((field) => ({
    value: field,
    label: CHANGE_FIELD_LABELS[field],
  })),
]

const SOURCE_OPTIONS: FilterOption[] = [
  ALL,
  ...(['simulated', 'manual', 'system'] as VersionSource[]).map((source) => ({
    value: source,
    label: SOURCE_LABELS[source],
  })),
]

const SEVERITY_OPTIONS: FilterOption[] = [
  ALL,
  ...(['critical', 'warning', 'info'] as AlertSeverity[]).map((severity) => ({
    value: severity,
    label: SEVERITY_LABELS[severity],
  })),
]

const PERIOD_LABELS: Record<(typeof MONITOR_PERIODS)[number], string> = {
  '30': 'Últimos 30 días',
  '90': 'Últimos 90 días',
  '365': 'Últimos 12 meses',
  all: 'Todo el historial',
}

const PERIOD_OPTIONS: FilterOption[] = MONITOR_PERIODS.map((period) => ({
  value: period,
  label: PERIOD_LABELS[period],
}))

interface MonitorFiltersProps {
  filters: MonitorFiltersState
  projects: readonly Project[]
  onChange: (patch: Partial<MonitorFiltersState>) => void
  onClear: () => void
}

export function MonitorFilters({
  filters,
  projects,
  onChange,
  onClear,
}: MonitorFiltersProps) {
  const projectOptions: FilterOption[] = [
    { value: 'all', label: 'Todos los proyectos' },
    ...projects.map((project) => ({
      value: project.id,
      label: `${project.code} · ${project.name}`,
    })),
  ]

  const active = hasActiveMonitorFilters(filters)

  return (
    <Card className="gap-3 p-4 sm:p-5">
      <div className="grid grid-cols-2 gap-3 xl:flex xl:flex-wrap xl:items-end">
        <FilterSelect
          label="Proyecto"
          value={filters.projectId || 'all'}
          options={projectOptions}
          onChange={(projectId) =>
            onChange({ projectId: projectId === 'all' ? '' : projectId })
          }
          className="col-span-2 xl:w-[240px]"
        />
        <FilterSelect
          label="Campo"
          value={filters.field}
          options={FIELD_OPTIONS}
          onChange={(field) => onChange({ field: field as ChangeType | 'all' })}
          className="xl:w-[150px]"
        />
        <FilterSelect
          label="Origen"
          value={filters.source}
          options={SOURCE_OPTIONS}
          onChange={(source) =>
            onChange({ source: source as VersionSource | 'all' })
          }
          className="xl:w-[140px]"
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
          label="Periodo"
          value={filters.period}
          options={PERIOD_OPTIONS}
          onChange={(period) =>
            onChange({
              period: period as MonitorFiltersState['period'],
            })
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
