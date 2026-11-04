import { ArrowDownAZ, ArrowUpAZ } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { ProjectSortField } from '@/data'
import { cn } from '@/lib/utils'
import type { ProjectFilters } from '../hooks/use-project-filters'
import {
  FilterSelect,
  type FilterOption,
} from '@/components/shared/filter-select'

const SORT_OPTIONS: FilterOption[] = [
  { value: 'updatedAt', label: 'Actualización' },
  { value: 'name', label: 'Nombre' },
  { value: 'dueDate', label: 'Fecha de entrega' },
  { value: 'budget', label: 'Presupuesto' },
]

interface ProjectsSortProps {
  sortBy: ProjectFilters['sortBy']
  sortDirection: ProjectFilters['sortDirection']
  onChange: (patch: Partial<ProjectFilters>) => void
  className?: string
}

export function ProjectsSort({
  sortBy,
  sortDirection,
  onChange,
  className,
}: ProjectsSortProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <span className="hidden text-xs text-muted-foreground sm:inline">
        Ordenar por
      </span>
      <FilterSelect
        label="Ordenar por"
        value={sortBy}
        options={SORT_OPTIONS}
        onChange={(value) => onChange({ sortBy: value as ProjectSortField })}
        showLabel={false}
        className="w-[150px]"
      />
      <Button
        type="button"
        variant="outline"
        size="icon"
        className="shrink-0"
        onClick={() =>
          onChange({
            sortDirection: sortDirection === 'asc' ? 'desc' : 'asc',
          })
        }
        aria-label={
          sortDirection === 'asc'
            ? 'Cambiar a orden descendente'
            : 'Cambiar a orden ascendente'
        }
        title={sortDirection === 'asc' ? 'Ascendente' : 'Descendente'}
      >
        {sortDirection === 'asc' ? (
          <ArrowUpAZ aria-hidden="true" className="size-4" />
        ) : (
          <ArrowDownAZ aria-hidden="true" className="size-4" />
        )}
      </Button>
    </div>
  )
}
