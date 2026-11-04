import { describe, expect, it } from 'vitest'
import {
  SCENARIOS,
  SIMULATION_SCENARIOS,
  scenarioOptions,
} from '@/features/monitoring/scenarios'
import { createProject } from './fixtures'

describe('simulation scenarios', () => {
  const project = createProject({
    currentBudgetCents: 100_000_000,
    dueDate: '2026-09-30',
    status: 'in_progress',
    priority: 'medium',
  })

  it('exposes every scenario as a selectable option', () => {
    expect(SIMULATION_SCENARIOS).toHaveLength(4)
    expect(scenarioOptions()).toHaveLength(4)
  })

  it('increases the current budget by 15 %', () => {
    expect(SCENARIOS['budget-increase'].buildInput(project)).toEqual({
      currentBudgetCents: 115_000_000,
    })
  })

  it('assigns budget from zero when the project has none', () => {
    expect(
      SCENARIOS['budget-increase'].buildInput(
        createProject({ currentBudgetCents: 0 }),
      ),
    ).toEqual({ currentBudgetCents: 50_000_000 })
  })

  it('postpones the deadline by 30 days', () => {
    expect(SCENARIOS['deadline-postponed'].buildInput(project)).toEqual({
      dueDate: '2026-10-30',
    })
  })

  it('builds status and priority changes', () => {
    expect(SCENARIOS['project-on-hold'].buildInput(project)).toEqual({
      status: 'on_hold',
    })
    expect(SCENARIOS['priority-critical'].buildInput(project)).toEqual({
      priority: 'critical',
    })
  })
})
