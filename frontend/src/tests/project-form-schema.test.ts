import { describe, expect, it } from 'vitest'
import {
  projectFormSchema,
  toFormValues,
  toProjectInput,
  type ProjectFormValues,
} from '@/features/projects/project-form-schema'
import { createProject } from './fixtures'

const valid: ProjectFormValues = {
  name: 'Centro logístico norte',
  client: 'Grupo Andino',
  description: 'Proyecto de construcción y puesta en marcha del centro.',
  sector: 'construction',
  ownerId: 'usr_0001',
  status: 'planned',
  priority: 'high',
  initialBudget: '2400000',
  currentBudget: '2640000',
  progress: '0',
  startDate: '2026-11-01',
  dueDate: '2027-06-30',
  completedAt: '',
  tags: 'logística, obra civil',
}

describe('project form schema', () => {
  it('accepts a coherent project', () => {
    expect(projectFormSchema.safeParse(valid).success).toBe(true)
  })

  it('rejects a due date before the start date', () => {
    const result = projectFormSchema.safeParse({
      ...valid,
      dueDate: '2026-10-01',
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0]?.path).toEqual(['dueDate'])
  })

  it('requires 100 % and a completion date for completed projects', () => {
    const result = projectFormSchema.safeParse({
      ...valid,
      status: 'completed',
      progress: '90',
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues.map((issue) => issue.path[0])).toEqual(
      expect.arrayContaining(['progress', 'completedAt']),
    )
  })

  it('rejects negative budgets and non-integer progress', () => {
    expect(
      projectFormSchema.safeParse({ ...valid, initialBudget: '-1' }).success,
    ).toBe(false)
    expect(
      projectFormSchema.safeParse({ ...valid, progress: '55.5' }).success,
    ).toBe(false)
  })

  it('limits tags to six', () => {
    const result = projectFormSchema.safeParse({
      ...valid,
      tags: 'a,b,c,d,e,f,g',
    })

    expect(result.success).toBe(false)
  })

  it('converts form values to the domain input', () => {
    const input = toProjectInput(valid)

    expect(input.initialBudgetCents).toBe(240_000_000)
    expect(input.currentBudgetCents).toBe(264_000_000)
    expect(input.progress).toBe(0)
    expect(input.tags).toEqual(['logística', 'obra civil'])
    expect(input.completedAt).toBeNull()
    expect(input.currency).toBe('PEN')
  })

  it('restores a project into editable form values', () => {
    const project = createProject({
      initialBudgetCents: 100_000_000,
      currentBudgetCents: 90_000_000,
      tags: ['ERP', 'procesos'],
      completedAt: null,
    })
    const values = toFormValues(project)

    expect(values.initialBudget).toBe('1000000')
    expect(values.currentBudget).toBe('900000')
    expect(values.tags).toBe('ERP, procesos')
    expect(values.completedAt).toBe('')
  })
})
