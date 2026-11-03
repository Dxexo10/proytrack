import { describe, expect, it } from 'vitest'
import { buildDashboardSummary } from '@/domain/services/dashboard-summary'
import type { Alert } from '@/domain/models'
import { createProject } from './fixtures'

const REFERENCE = '2026-10-31'

const alert: Alert = {
  id: 'alt_0001',
  projectId: 'prj_overdue',
  ruleId: 'budget-increase-warning',
  severity: 'warning',
  status: 'open',
  title: 'Incremento presupuestal relevante',
  description: 'El presupuesto aumentó un 20 %.',
  createdAt: '2026-10-20T10:00:00.000Z',
  reviewedAt: null,
  resolvedAt: null,
}

const projects = [
  createProject({
    id: 'prj_overdue',
    status: 'in_progress',
    dueDate: '2026-09-30',
    progress: 55,
    createdAt: '2026-10-01T10:00:00.000Z',
    initialBudgetCents: 240_000_000,
    currentBudgetCents: 288_000_000,
  }),
  createProject({
    id: 'prj_completed',
    status: 'completed',
    progress: 100,
    dueDate: '2026-08-15',
    completedAt: '2026-09-15',
    createdAt: '2026-06-01T10:00:00.000Z',
    initialBudgetCents: 100_000_000,
    currentBudgetCents: 104_000_000,
  }),
  createProject({
    id: 'prj_planned',
    status: 'planned',
    progress: 0,
    dueDate: '2027-03-15',
    createdAt: '2026-02-01T10:00:00.000Z',
    initialBudgetCents: 50_000_000,
    currentBudgetCents: 50_000_000,
  }),
]

describe('buildDashboardSummary', () => {
  const summary = buildDashboardSummary({
    projects,
    alerts: [alert],
    filters: { periodMonths: 12 },
    referenceDate: REFERENCE,
  })

  it('counts projects inside the selected window', () => {
    expect(summary.totals.projects).toBe(3)
    expect(summary.totals.inProgress).toBe(1)
    expect(summary.totals.completed).toBe(1)
  })

  it('flags overdue active projects as requiring attention', () => {
    expect(summary.totals.overdue).toBe(1)
    expect(summary.totals.attention).toBe(1)
    expect(summary.attentionProjects[0]?.project.id).toBe('prj_overdue')
  })

  it('aggregates budgets and their variation', () => {
    expect(summary.totals.plannedBudgetCents).toBe(390_000_000)
    expect(summary.totals.currentBudgetCents).toBe(442_000_000)
    expect(summary.budgetVariationPct).toBeCloseTo(13.33, 1)
  })

  it('counts open alerts by severity', () => {
    expect(summary.totals.openAlerts).toBe(1)
    expect(
      summary.alertsBySeverity.find((slice) => slice.severity === 'warning')
        ?.count,
    ).toBe(1)
  })

  it('builds one trend point per month in the period', () => {
    expect(summary.trend).toHaveLength(12)
    expect(summary.trend.at(-1)?.month).toBe('2026-10')
  })

  it('keeps the five status buckets in the distribution', () => {
    expect(summary.statusDistribution).toHaveLength(5)
    expect(
      summary.statusDistribution.find((slice) => slice.status === 'completed')
        ?.count,
    ).toBe(1)
  })

  it('compares against the previous window', () => {
    const previous = buildDashboardSummary({
      projects: [
        ...projects,
        createProject({
          id: 'prj_old',
          createdAt: '2025-08-01T10:00:00.000Z',
          status: 'in_progress',
        }),
      ],
      alerts: [alert],
      filters: { periodMonths: 6 },
      referenceDate: REFERENCE,
    })

    expect(previous.totals.projects).toBe(2)
    expect(previous.deltas.projects).not.toBeNull()
  })
})
