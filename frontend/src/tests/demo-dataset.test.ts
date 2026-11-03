import { describe, expect, it } from 'vitest'
import { generateActivity } from '@/data/mock/seed/activity'
import { generateAlerts } from '@/data/mock/seed/alerts'
import { generateProjects } from '@/data/mock/seed/projects'
import { createRandom } from '@/data/mock/seed/random'
import { buildDashboardSummary } from '@/domain/services/dashboard-summary'
import { DEMO_REFERENCE_DATE, DEMO_SEED } from '@/lib/demo-config'

function generate() {
  const random = createRandom(DEMO_SEED)
  const projects = generateProjects(random)
  const alerts = generateAlerts(random, projects)
  const activity = generateActivity(random, projects, alerts)
  return { projects, alerts, activity }
}

describe('demo dataset', () => {
  it('is deterministic for the documented seed', () => {
    expect(generate().projects).toEqual(generate().projects)
  })

  it('generates a coherent 50-project portfolio', () => {
    const { projects } = generate()

    expect(projects).toHaveLength(50)
    expect(new Set(projects.map((project) => project.id)).size).toBe(50)
    expect(new Set(projects.map((project) => project.code)).size).toBe(50)

    for (const project of projects) {
      expect(project.progress).toBeGreaterThanOrEqual(0)
      expect(project.progress).toBeLessThanOrEqual(100)
      expect(project.initialBudgetCents).toBeGreaterThanOrEqual(0)
      expect(project.currentBudgetCents).toBeGreaterThanOrEqual(0)
      expect(project.dueDate >= project.startDate).toBe(true)

      if (project.status === 'completed') {
        expect(project.progress).toBe(100)
        expect(project.completedAt).not.toBeNull()
      }
    }
  })

  it('derives alerts and activity from the same project state', () => {
    const { projects, alerts, activity } = generate()

    expect(alerts.length).toBeGreaterThan(10)
    expect(activity.length).toBeGreaterThan(projects.length)
    expect(
      alerts.every((alert) =>
        projects.some((project) => project.id === alert.projectId),
      ),
    ).toBe(true)
  })

  it('keeps every timestamp on or before the demo reference date', () => {
    const { projects, alerts, activity } = generate()
    const reference = `${DEMO_REFERENCE_DATE}T23:59:59.999Z`

    expect(
      projects.every((project) => project.updatedAt <= reference),
    ).toBe(true)
    expect(alerts.every((alert) => alert.createdAt <= reference)).toBe(true)
    expect(activity.every((entry) => entry.createdAt <= reference)).toBe(true)
  })

  it('reports the full portfolio for every dashboard period', () => {
    const { projects, alerts } = generate()

    for (const periodMonths of [3, 6, 12] as const) {
      const summary = buildDashboardSummary({
        projects,
        alerts,
        filters: { periodMonths },
        referenceDate: DEMO_REFERENCE_DATE,
      })

      expect(summary.periodMonths).toBe(periodMonths)
      expect(summary.totals.projects).toBe(projects.length)
      expect(summary.totals.completed).toBeGreaterThan(0)
      expect(summary.totals.openAlerts).toBeGreaterThan(0)
      expect(
        summary.statusDistribution.reduce((total, slice) => total + slice.count, 0),
      ).toBe(projects.length)
    }
  })
})
