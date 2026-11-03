import { describe, expect, it } from 'vitest'
import type { User } from '@/domain/models'
import { buildChangeFeed } from '@/domain/services/change-feed'
import {
  createAlert,
  createChangeEvent,
  createProject,
  createVersion,
} from './fixtures'

const USER: User = {
  id: 'usr_0001',
  name: 'Sofía Herrera',
  email: 'sofia@trazo.demo',
  role: 'manager',
}

const projectA = createProject({ id: 'prj_a', code: 'PRJ-001' })
const projectB = createProject({ id: 'prj_b', code: 'PRJ-002' })
const archivedProject = createProject({
  id: 'prj_c',
  code: 'PRJ-003',
  archivedAt: '2026-09-01T00:00:00.000Z',
})

const versionA1 = createVersion({
  id: 'ver_a1',
  projectId: 'prj_a',
  versionNumber: 1,
  snapshot: projectA,
  changedAt: '2026-10-01T09:00:00.000Z',
  source: 'system',
})
const versionA2 = createVersion({
  id: 'ver_a2',
  projectId: 'prj_a',
  versionNumber: 2,
  snapshot: projectA,
  changedAt: '2026-10-20T09:00:00.000Z',
  source: 'manual',
})
const versionB1 = createVersion({
  id: 'ver_b1',
  projectId: 'prj_b',
  versionNumber: 1,
  snapshot: projectB,
  changedAt: '2026-09-15T09:00:00.000Z',
  source: 'simulated',
})
const versionC1 = createVersion({
  id: 'ver_c1',
  projectId: 'prj_c',
  versionNumber: 1,
  snapshot: archivedProject,
  changedAt: '2026-09-20T09:00:00.000Z',
  source: 'simulated',
})

const changeA1 = createChangeEvent({
  id: 'chg_a1',
  projectId: 'prj_a',
  versionId: 'ver_a1',
  field: 'status',
  oldValue: 'planned',
  newValue: 'in_progress',
  changeType: 'status',
})
const changeA2 = createChangeEvent({
  id: 'chg_a2',
  projectId: 'prj_a',
  versionId: 'ver_a2',
  field: 'budget',
})
const changeB1 = createChangeEvent({
  id: 'chg_b1',
  projectId: 'prj_b',
  versionId: 'ver_b1',
  field: 'budget',
})
const changeC1 = createChangeEvent({
  id: 'chg_c1',
  projectId: 'prj_c',
  versionId: 'ver_c1',
  field: 'budget',
})

const alertA1 = createAlert({
  id: 'alt_a1',
  projectId: 'prj_a',
  versionId: 'ver_a1',
  severity: 'info',
})
const alertA2 = createAlert({
  id: 'alt_a2',
  projectId: 'prj_a',
  versionId: 'ver_a2',
  severity: 'critical',
})

const baseInput = {
  changes: [changeA1, changeA2, changeB1, changeC1],
  versions: [versionA1, versionA2, versionB1, versionC1],
  alerts: [alertA1, alertA2],
  projects: [projectA, projectB, archivedProject],
  users: [USER],
}

describe('buildChangeFeed', () => {
  it('joins versions, projects, actors and alerts, excluding archived by default', () => {
    const result = buildChangeFeed(baseInput)

    expect(result.total).toBe(3)
    expect(result.items.map((item) => item.change.id)).toEqual([
      'chg_a2',
      'chg_a1',
      'chg_b1',
    ])
    expect(result.items[0]).toMatchObject({
      actor: USER,
      project: projectA,
      severity: 'critical',
    })
    expect(result.items[0]?.alerts).toHaveLength(1)
  })

  it('includes archived projects on demand', () => {
    const result = buildChangeFeed({
      ...baseInput,
      filters: { includeArchived: true },
    })

    expect(result.total).toBe(4)
    expect(result.items.some((item) => item.change.id === 'chg_c1')).toBe(true)
  })

  it('filters by project', () => {
    const result = buildChangeFeed({
      ...baseInput,
      filters: { projectId: 'prj_a' },
    })

    expect(result.items.map((item) => item.change.id)).toEqual([
      'chg_a2',
      'chg_a1',
    ])
  })

  it('filters by field and source', () => {
    expect(
      buildChangeFeed({
        ...baseInput,
        filters: { field: 'budget' },
      }).items.map((item) => item.change.id),
    ).toEqual(['chg_a2', 'chg_b1'])

    expect(
      buildChangeFeed({
        ...baseInput,
        filters: { source: 'manual' },
      }).items.map((item) => item.change.id),
    ).toEqual(['chg_a2'])
  })

  it('filters by severity using the alerts of the version', () => {
    const result = buildChangeFeed({
      ...baseInput,
      filters: { severity: 'critical' },
    })

    expect(result.items.map((item) => item.change.id)).toEqual(['chg_a2'])
  })

  it('filters by date range', () => {
    const result = buildChangeFeed({
      ...baseInput,
      filters: { from: '2026-10-05', to: '2026-10-25' },
    })

    expect(result.items.map((item) => item.change.id)).toEqual(['chg_a2'])
  })

  it('paginates the filtered feed', () => {
    const first = buildChangeFeed({ ...baseInput, page: 1, pageSize: 1 })
    const second = buildChangeFeed({ ...baseInput, page: 2, pageSize: 1 })

    expect(first.total).toBe(3)
    expect(first.items.map((item) => item.change.id)).toEqual(['chg_a2'])
    expect(second.items.map((item) => item.change.id)).toEqual(['chg_a1'])
  })
})
