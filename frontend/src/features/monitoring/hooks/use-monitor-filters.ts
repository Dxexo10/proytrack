import { useSearchParams } from 'react-router-dom'
import {
  ALERT_SEVERITIES,
  CHANGE_TYPES,
  type AlertSeverity,
  type ChangeType,
  type VersionSource,
} from '@/domain/models'

export const MONITOR_PAGE_SIZE = 20

export const MONITOR_PERIODS = ['30', '90', '365', 'all'] as const
export type MonitorPeriod = (typeof MONITOR_PERIODS)[number]

export const MONITOR_SOURCES: VersionSource[] = [
  'simulated',
  'manual',
  'system',
]

export interface MonitorFilters {
  projectId: string
  field: ChangeType | 'all'
  source: VersionSource | 'all'
  severity: AlertSeverity | 'all'
  period: MonitorPeriod
  page: number
}

export const DEFAULT_MONITOR_FILTERS: MonitorFilters = {
  projectId: '',
  field: 'all',
  source: 'all',
  severity: 'all',
  period: '90',
  page: 1,
}

function parseEnum<T extends string>(
  value: string | null,
  options: readonly T[],
  fallback: T | 'all',
): T | 'all' {
  return value && options.includes(value as T) ? (value as T) : fallback
}

export function parseMonitorFilters(params: URLSearchParams): MonitorFilters {
  const page = Number(params.get('pagina'))

  return {
    projectId: params.get('proyecto') ?? '',
    field: parseEnum(params.get('campo'), CHANGE_TYPES, 'all'),
    source: parseEnum(params.get('origen'), MONITOR_SOURCES, 'all'),
    severity: parseEnum(params.get('severidad'), ALERT_SEVERITIES, 'all'),
    period:
      (params.get('periodo') as MonitorPeriod | null) &&
      MONITOR_PERIODS.includes(params.get('periodo') as MonitorPeriod)
        ? (params.get('periodo') as MonitorPeriod)
        : DEFAULT_MONITOR_FILTERS.period,
    page: Number.isInteger(page) && page > 0 ? page : 1,
  }
}

export function serialiseMonitorFilters(
  filters: MonitorFilters,
): URLSearchParams {
  const params = new URLSearchParams()

  if (filters.projectId) params.set('proyecto', filters.projectId)
  if (filters.field !== 'all') params.set('campo', filters.field)
  if (filters.source !== 'all') params.set('origen', filters.source)
  if (filters.severity !== 'all') params.set('severidad', filters.severity)
  if (filters.period !== DEFAULT_MONITOR_FILTERS.period) {
    params.set('periodo', filters.period)
  }
  if (filters.page > 1) params.set('pagina', String(filters.page))

  return params
}

export function hasActiveMonitorFilters(filters: MonitorFilters): boolean {
  return Boolean(
    filters.projectId ||
    filters.field !== 'all' ||
    filters.source !== 'all' ||
    filters.severity !== 'all' ||
    filters.period !== DEFAULT_MONITOR_FILTERS.period,
  )
}

export function useMonitorFilters() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = parseMonitorFilters(searchParams)

  const update = (patch: Partial<MonitorFilters>) => {
    const next: MonitorFilters = {
      ...filters,
      ...patch,
      page: patch.page ?? 1,
    }
    setSearchParams(serialiseMonitorFilters(next), { replace: true })
  }

  const clear = () => {
    setSearchParams(new URLSearchParams(), { replace: true })
  }

  return { filters, update, clear }
}
