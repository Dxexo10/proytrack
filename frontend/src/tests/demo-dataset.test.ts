import { describe, expect, it } from 'vitest'
import { generateActivity } from '@/data/mock/seed/activity'
import { generateAlerts } from '@/data/mock/seed/alerts'
import { generateProjects } from '@/data/mock/seed/projects'
import { createRandom } from '@/data/mock/seed/random'
import { generateRuleConfigs } from '@/data/mock/seed/rules'
import { generateVersions } from '@/data/mock/seed/versions'
import { buildDashboardSummary } from '@/domain/services/dashboard-summary'
import { DEMO_REFERENCE_DATE, DEMO_SEED } from '@/lib/demo-config'

function generate() {
  const random = createRandom(DEMO_SEED)
  const projects = generateProjects(random)
  const { versions, changes } = generateVersions(random, projects)
  const rules = generateRuleConfigs()
  const alerts = generateAlerts(versions, rules)
  const activity = generateActivity(random, projects, alerts, versions)
  return { projects, versions, changes, alerts, activity, rules }
}

describe('demo dataset', () => {
  it('is deterministic for the documented seed', () => {
    const first = generate()
    const second = generate()

    expect(first.projects).toEqual(second.projects)
    expect(first.versions).toEqual(second.versions)
    expect(first.changes).toEqual(second.changes)
    expect(first.alerts).toEqual(second.alerts)
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

  it('seeds immutable versions and coherent change events', () => {
    const { projects, versions, changes } = generate()
    const projectIds = new Set(projects.map((project) => project.id))
    const versionIds = new Set(versions.map((version) => version.id))

    expect(versions.length).toBeGreaterThan(projects.length)
    expect(new Set(versions.map((version) => version.id)).size).toBe(
      versions.length,
    )
    expect(versions.every((version) => projectIds.has(version.projectId))).toBe(
      true,
    )
    expect(new Set(changes.map((change) => change.id)).size).toBe(
      changes.length,
    )
    expect(
      changes.every(
        (change) =>
          versionIds.has(change.versionId) &&
          change.oldValue !== change.newValue,
      ),
    ).toBe(true)

    for (const project of projects) {
      const projectVersions = versions
        .filter((version) => version.projectId === project.id)
        .sort((a, b) => a.versionNumber - b.versionNumber)

      expect(projectVersions.length).toBeGreaterThanOrEqual(2)
      expect(projectVersions[0]?.versionNumber).toBe(1)
      expect(projectVersions.at(-1)?.snapshot).toEqual(project)
    }
  })

  it('derives alerts from versions and rule configs', () => {
    const { projects, versions, alerts, rules, activity } = generate()
    const versionIds = new Set(versions.map((version) => version.id))
    const dedupeKeys = alerts.map(
      (alert) => `${alert.projectId}:${alert.versionId}:${alert.ruleId}`,
    )

    expect(rules).toHaveLength(7)
    expect(alerts.length).toBeGreaterThan(10)
    expect(activity.length).toBeGreaterThan(projects.length)
    expect(
      alerts.every(
        (alert) =>
          projects.some((project) => project.id === alert.projectId) &&
          alert.versionId !== undefined &&
          versionIds.has(alert.versionId),
      ),
    ).toBe(true)
    expect(new Set(dedupeKeys).size).toBe(dedupeKeys.length)
  })

  it('keeps every timestamp on or before the demo reference date', () => {
    const { projects, versions, changes, alerts, activity } = generate()
    const reference = `${DEMO_REFERENCE_DATE}T23:59:59.999Z`

    expect(projects.every((project) => project.updatedAt <= reference)).toBe(
      true,
    )
    expect(versions.every((version) => version.changedAt <= reference)).toBe(
      true,
    )
    expect(changes.length).toBeGreaterThan(0)
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
        summary.statusDistribution.reduce(
          (total, slice) => total + slice.count,
          0,
        ),
      ).toBe(projects.length)
    }
  })
})
