import { describe, expect, it } from 'vitest'
import { diffProject } from '@/domain/services/project-diff'
import { createProject } from './fixtures'

describe('diffProject', () => {
  it('returns no changes for identical projects', () => {
    const project = createProject()
    expect(diffProject(project, { ...project })).toEqual([])
  })

  it('detects budget changes in cents', () => {
    const previous = createProject({ currentBudgetCents: 288_000_000 })
    const next = createProject({ currentBudgetCents: 290_000_000 })

    expect(diffProject(previous, next)).toEqual([
      {
        field: 'budget',
        oldValue: '288000000',
        newValue: '290000000',
      },
    ])
  })

  it('detects every auditable field', () => {
    const previous = createProject()
    const next = createProject({
      currentBudgetCents: 300_000_000,
      dueDate: '2027-01-15',
      status: 'on_hold',
      progress: 70,
      priority: 'critical',
      ownerId: 'usr_0002',
    })

    expect(diffProject(previous, next)).toEqual([
      { field: 'budget', oldValue: '288000000', newValue: '300000000' },
      { field: 'deadline', oldValue: '2026-09-30', newValue: '2027-01-15' },
      { field: 'status', oldValue: 'in_progress', newValue: 'on_hold' },
      { field: 'progress', oldValue: '55', newValue: '70' },
      { field: 'priority', oldValue: 'medium', newValue: 'critical' },
      { field: 'owner', oldValue: 'usr_0001', newValue: 'usr_0002' },
    ])
  })

  it('ignores fields outside the audit scope', () => {
    const previous = createProject()
    const next = createProject({
      name: 'Otro nombre',
      description: 'Otra descripción distinta.',
      client: 'Otro cliente',
      tags: ['ERP', 'Finanzas'],
      updatedAt: '2026-10-25T09:00:00.000Z',
    })

    expect(diffProject(previous, next)).toEqual([])
  })
})
