import { describe, expect, it } from 'vitest'
import {
  DEFAULT_MONITOR_FILTERS,
  hasActiveMonitorFilters,
  parseMonitorFilters,
  serialiseMonitorFilters,
} from '@/features/monitoring/hooks/use-monitor-filters'

describe('monitor filters', () => {
  it('parses defaults from an empty query', () => {
    expect(parseMonitorFilters(new URLSearchParams())).toEqual(
      DEFAULT_MONITOR_FILTERS,
    )
  })

  it('parses every supported filter from the URL', () => {
    const filters = parseMonitorFilters(
      new URLSearchParams({
        proyecto: 'prj_0001',
        campo: 'budget',
        origen: 'manual',
        severidad: 'critical',
        periodo: '30',
        pagina: '3',
      }),
    )

    expect(filters).toEqual({
      projectId: 'prj_0001',
      field: 'budget',
      source: 'manual',
      severity: 'critical',
      period: '30',
      page: 3,
    })
  })

  it('ignores invalid enum values and page numbers', () => {
    const filters = parseMonitorFilters(
      new URLSearchParams({
        campo: 'unknown',
        origen: 'unknown',
        severidad: 'unknown',
        periodo: 'unknown',
        pagina: '-4',
      }),
    )

    expect(filters.field).toBe('all')
    expect(filters.source).toBe('all')
    expect(filters.severity).toBe('all')
    expect(filters.period).toBe(DEFAULT_MONITOR_FILTERS.period)
    expect(filters.page).toBe(1)
  })

  it('omits defaults when serialising', () => {
    expect(serialiseMonitorFilters(DEFAULT_MONITOR_FILTERS).toString()).toBe('')
  })

  it('round-trips and detects active filters', () => {
    const filters = {
      ...DEFAULT_MONITOR_FILTERS,
      projectId: 'prj_0001',
      field: 'deadline' as const,
      period: '365' as const,
      page: 2,
    }
    const serialised = serialiseMonitorFilters(filters)

    expect(parseMonitorFilters(serialised)).toEqual(filters)
    expect(hasActiveMonitorFilters(filters)).toBe(true)
    expect(hasActiveMonitorFilters(DEFAULT_MONITOR_FILTERS)).toBe(false)
  })
})
