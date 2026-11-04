import { describe, expect, it } from 'vitest'
import {
  DEFAULT_ALERT_FILTERS,
  hasActiveAlertFilters,
  parseAlertFilters,
  serialiseAlertFilters,
} from '@/features/alerts/hooks/use-alert-filters'

describe('alert filters', () => {
  it('parses defaults from an empty query', () => {
    expect(parseAlertFilters(new URLSearchParams())).toEqual(
      DEFAULT_ALERT_FILTERS,
    )
  })

  it('parses every supported filter from the URL', () => {
    expect(
      parseAlertFilters(
        new URLSearchParams({
          estado: 'reviewed',
          severidad: 'critical',
          proyecto: 'prj_0001',
          periodo: '30',
          pagina: '2',
        }),
      ),
    ).toEqual({
      status: 'reviewed',
      severity: 'critical',
      projectId: 'prj_0001',
      period: '30',
      page: 2,
    })
  })

  it('ignores invalid values and pages', () => {
    const filters = parseAlertFilters(
      new URLSearchParams({
        estado: 'unknown',
        severidad: 'unknown',
        periodo: 'unknown',
        pagina: '0',
      }),
    )

    expect(filters.status).toBe('all')
    expect(filters.severity).toBe('all')
    expect(filters.period).toBe(DEFAULT_ALERT_FILTERS.period)
    expect(filters.page).toBe(1)
  })

  it('omits defaults when serialising and detects active filters', () => {
    expect(serialiseAlertFilters(DEFAULT_ALERT_FILTERS).toString()).toBe('')
    expect(hasActiveAlertFilters(DEFAULT_ALERT_FILTERS)).toBe(false)

    const filters = {
      ...DEFAULT_ALERT_FILTERS,
      status: 'open' as const,
      period: '90' as const,
      page: 2,
    }
    expect(parseAlertFilters(serialiseAlertFilters(filters))).toEqual(filters)
    expect(hasActiveAlertFilters(filters)).toBe(true)
  })
})
