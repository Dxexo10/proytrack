import { useSearchParams } from 'react-router-dom'
import { ACTIVITY_SOURCES, type ActivitySource } from '@/domain/models'

export const ACTIVITY_PAGE_SIZE = 20

export const ACTIVITY_PERIODS = ['30', '90', '365', 'all'] as const
export type ActivityPeriod = (typeof ACTIVITY_PERIODS)[number]

export interface ActivityFilters {
  projectId: string
  actorId: string
  action: string
  source: ActivitySource | 'all'
  period: ActivityPeriod
  page: number
}

export const DEFAULT_ACTIVITY_FILTERS: ActivityFilters = {
  projectId: '',
  actorId: '',
  action: 'all',
  source: 'all',
  period: 'all',
  page: 1,
}

function parseSource(value: string | null): ActivitySource | 'all' {
  return value && ACTIVITY_SOURCES.includes(value as ActivitySource)
    ? (value as ActivitySource)
    : 'all'
}

export function parseActivityFilters(params: URLSearchParams): ActivityFilters {
  const page = Number(params.get('pagina'))

  return {
    projectId: params.get('proyecto') ?? '',
    actorId: params.get('actor') ?? '',
    action: params.get('accion') ?? 'all',
    source: parseSource(params.get('origen')),
    period:
      params.get('periodo') &&
      ACTIVITY_PERIODS.includes(params.get('periodo') as ActivityPeriod)
        ? (params.get('periodo') as ActivityPeriod)
        : DEFAULT_ACTIVITY_FILTERS.period,
    page: Number.isInteger(page) && page > 0 ? page : 1,
  }
}

export function serialiseActivityFilters(
  filters: ActivityFilters,
): URLSearchParams {
  const params = new URLSearchParams()

  if (filters.projectId) params.set('proyecto', filters.projectId)
  if (filters.actorId) params.set('actor', filters.actorId)
  if (filters.action !== 'all') params.set('accion', filters.action)
  if (filters.source !== 'all') params.set('origen', filters.source)
  if (filters.period !== DEFAULT_ACTIVITY_FILTERS.period) {
    params.set('periodo', filters.period)
  }
  if (filters.page > 1) params.set('pagina', String(filters.page))

  return params
}

export function hasActiveActivityFilters(filters: ActivityFilters): boolean {
  return Boolean(
    filters.projectId ||
    filters.actorId ||
    filters.action !== 'all' ||
    filters.source !== 'all' ||
    filters.period !== DEFAULT_ACTIVITY_FILTERS.period,
  )
}

export function useActivityFilters() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = parseActivityFilters(searchParams)

  const update = (patch: Partial<ActivityFilters>) => {
    const next: ActivityFilters = {
      ...filters,
      ...patch,
      page: patch.page ?? 1,
    }
    setSearchParams(serialiseActivityFilters(next), { replace: true })
  }

  const clear = () => {
    setSearchParams(new URLSearchParams(), { replace: true })
  }

  return { filters, update, clear }
}
