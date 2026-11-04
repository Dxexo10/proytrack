import { describe, expect, it } from 'vitest'
import {
  DEFAULT_ACTIVITY_FILTERS,
  hasActiveActivityFilters,
  parseActivityFilters,
  serialiseActivityFilters,
} from '@/features/activity/hooks/use-activity-filters'

describe('activity filters', () => {
  it('parses defaults from an empty query', () => {
    expect(parseActivityFilters(new URLSearchParams())).toEqual(
      DEFAULT_ACTIVITY_FILTERS,
    )
  })

  it('parses every supported filter from the URL', () => {
    expect(
      parseActivityFilters(
        new URLSearchParams({
          proyecto: 'prj_0001',
          actor: 'usr_0002',
          accion: 'version.created',
          origen: 'manual',
          periodo: '90',
          pagina: '2',
        }),
      ),
    ).toEqual({
      projectId: 'prj_0001',
      actorId: 'usr_0002',
      action: 'version.created',
      source: 'manual',
      period: '90',
      page: 2,
    })
  })

  it('ignores invalid origin and period values', () => {
    const filters = parseActivityFilters(
      new URLSearchParams({
        origen: 'unknown',
        periodo: 'unknown',
        pagina: '0',
      }),
    )

    expect(filters.source).toBe('all')
    expect(filters.period).toBe(DEFAULT_ACTIVITY_FILTERS.period)
    expect(filters.page).toBe(1)
  })

  it('omits defaults when serialising and detects active filters', () => {
    expect(serialiseActivityFilters(DEFAULT_ACTIVITY_FILTERS).toString()).toBe(
      '',
    )
    expect(hasActiveActivityFilters(DEFAULT_ACTIVITY_FILTERS)).toBe(false)

    const filters = {
      ...DEFAULT_ACTIVITY_FILTERS,
      action: 'version.created',
      source: 'manual' as const,
      page: 2,
    }
    expect(parseActivityFilters(serialiseActivityFilters(filters))).toEqual(
      filters,
    )
    expect(hasActiveActivityFilters(filters)).toBe(true)
  })
})
