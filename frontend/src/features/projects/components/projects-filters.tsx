import { ArrowDownAZ, ArrowUpAZ, Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import type { ProjectSortField } from '@/data'
import {
  PRIORITY_LABELS,
  SECTOR_LABELS,
  STATUS_LABELS,
} from '@/lib/labels'
import {
  PROJECT_PRIORITIES,
  PROJECT_STATUSES,
  SECTORS,
  type User,
} from '@/domain/models'
import { cn } from '@/lib/utils'
import {
  hasActiveFilters,
  type ProjectFilters,
} from '../hooks/use-project-filters'
import { FilterSelect, type FilterOption } from './project-filter-select'

const ALL: FilterOption = { value: 'all', label: 'Todos' }

const STATUS_OPTIONS: FilterOption[] = [
  ALL,
  ...PROJECT_STATUSES.map((status) => ({
    value: status,
    label: STATUS_LABELS[status],
  })),
]

const PRIORITY_OPTIONS: FilterOption[] = [
  ALL,
  ...PROJECT_PRIORITIES.map((priority) => ({
    value: priority,
    label: PRIORITY_LABELS[priority],
  })),
]

const SECTOR_OPTIONS: FilterOption[] = [
  ALL,
  ...SECTORS.map((sector) => ({
    value: sector,
    label: SECTOR_LABELS[sector],
  })),
]

const RISK_OPTIONS: FilterOption[] = [
  ALL,
  { value: 'alto', label: 'Riesgo alto' },
  { value: 'medio', label: 'Riesgo medio' },
]

const SORT_OPTIONS: FilterOption[] = [
  { value: 'updatedAt', label: 'Actualización' },
  { value: 'name', label: 'Nombre' },
  { value: 'dueDate', label: 'Fecha de entrega' },
  { value: 'budget', label: 'Presupuesto' },
]

interface ProjectsFiltersProps {
  filters: ProjectFilters
  users: readonly User[]
  onChange: (patch: Partial<ProjectFilters>) => void
  onClear: () => void
}

export function ProjectsFilters({
  filters,
  users,
  onChange,
  onClear,
}: ProjectsFiltersProps) {
  const ownerOptions: FilterOption[] = [
    { value: 'all', label: 'Todos' },
    ...users.map((user) => ({ value: user.id, label: user.name })),
  ]

  return (
    <Card className="gap-4 p-4">
      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div className="space-y-1.5 sm:col-span-2">
          <Label
            htmlFor="project-search"
            className="text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase"
          >
            Buscar
          </Label>
          <div className="relative">
            <Search
              aria-hidden="true"
              className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              id="project-search"
              type="search"
              value={filters.search}
              onChange={(event) => onChange({ search: event.target.value })}
              placeholder="Nombre, código o cliente"
              className="h-9 bg-surface pl-9"
            />
          </div>
        </div>

        <FilterSelect
          label="Estado"
          value={filters.status}
          options={STATUS_OPTIONS}
          onChange={(status) =>
            onChange({ status: status as ProjectFilters['status'] })
          }
        />
        <FilterSelect
          label="Prioridad"
          value={filters.priority}
          options={PRIORITY_OPTIONS}
          onChange={(priority) =>
            onChange({ priority: priority as ProjectFilters['priority'] })
          }
        />
        <FilterSelect
          label="Sector"
          value={filters.sector}
          options={SECTOR_OPTIONS}
          onChange={(sector) =>
            onChange({ sector: sector as ProjectFilters['sector'] })
          }
        />
        <FilterSelect
          label="Responsable"
          value={filters.ownerId || 'all'}
          options={ownerOptions}
          onChange={(ownerId) =>
            onChange({ ownerId: ownerId === 'all' ? '' : ownerId })
          }
        />
        <FilterSelect
          label="Riesgo"
          value={filters.risk}
          options={RISK_OPTIONS}
          onChange={(risk) =>
            onChange({ risk: risk as ProjectFilters['risk'] })
          }
        />
        <div className="space-y-1.5">
          <Label className="text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
            Ordenar por
          </Label>
          <div className="flex gap-2">
            <FilterSelect
              label="Ordenar por"
              value={filters.sortBy}
              options={SORT_OPTIONS}
              onChange={(sortBy) =>
                onChange({ sortBy: sortBy as ProjectSortField })
              }
              showLabel={false}
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="shrink-0"
              onClick={() =>
                onChange({
                  sortDirection:
                    filters.sortDirection === 'asc' ? 'desc' : 'asc',
                })
              }
              aria-label={
                filters.sortDirection === 'asc'
                  ? 'Cambiar a orden descendente'
                  : 'Cambiar a orden ascendente'
              }
              title={
                filters.sortDirection === 'asc'
                  ? 'Ascendente'
                  : 'Descendente'
              }
            >
              {filters.sortDirection === 'asc' ? (
                <ArrowUpAZ aria-hidden="true" className="size-4" />
              ) : (
                <ArrowDownAZ aria-hidden="true" className="size-4" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3">
        <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-muted-foreground">
          <Switch
            checked={filters.includeArchived}
            onCheckedChange={(checked) =>
              onChange({ includeArchived: Boolean(checked) })
            }
            aria-label="Incluir proyectos archivados"
          />
          Incluir archivados
        </label>

        {hasActiveFilters(filters) ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={onClear}
            className={cn('gap-1.5 text-brand-terracotta-hover')}
          >
            <X aria-hidden="true" className="size-3.5" />
            Limpiar filtros
          </Button>
        ) : null}
      </div>
    </Card>
  )
}
