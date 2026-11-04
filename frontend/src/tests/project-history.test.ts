import { beforeEach, describe, expect, it } from 'vitest'
import {
  activityRepository,
  alertRepository,
  changeEventRepository,
  projectRepository,
  resetDemoData,
  ruleConfigRepository,
  versionRepository,
} from '@/data'

const NOW = '2026-11-01T10:00:00.000Z'
const OPTIONS = {
  actorId: 'usr_0001',
  source: 'manual' as const,
  reason: 'Ajuste de prueba',
  now: NOW,
}

describe('project history', () => {
  beforeEach(async () => {
    await resetDemoData()
  })

  it('creates a version, change events and alerts on update', async () => {
    const project = await projectRepository.getById('prj_0001')
    expect(project).not.toBeNull()
    if (!project) return

    const nextBudget = Math.round(project.currentBudgetCents * 1.25)
    const result = await projectRepository.update(
      project.id,
      { currentBudgetCents: nextBudget },
      OPTIONS,
    )

    expect(result.changed).toBe(true)
    expect(result.version).not.toBeNull()
    expect(result.version?.versionNumber).toBeGreaterThan(1)
    expect(result.version?.reason).toBe(OPTIONS.reason)
    expect(result.version?.snapshot.currentBudgetCents).toBe(nextBudget)

    const budgetChange = result.changes.find(
      (change) => change.field === 'budget',
    )
    expect(budgetChange).toMatchObject({
      oldValue: String(project.currentBudgetCents),
      newValue: String(nextBudget),
    })

    expect(result.alerts.length).toBeGreaterThan(0)
    expect(
      result.alerts.every(
        (alert) =>
          alert.versionId === result.version?.id && alert.status === 'open',
      ),
    ).toBe(true)

    const versions = await projectRepository.listVersions(project.id)
    expect(versions[0]?.id).toBe(result.version?.id)

    const changes = await changeEventRepository.listByProject(project.id)
    expect(changes.some((change) => change.id === budgetChange?.id)).toBe(true)
  })

  it('does not create a version when the audited fields are unchanged', async () => {
    const project = await projectRepository.getById('prj_0002')
    expect(project).not.toBeNull()
    if (!project) return

    const before = await projectRepository.listVersions(project.id)
    const result = await projectRepository.update(
      project.id,
      {
        name: `${project.name} (nombre actualizado)`,
        currentBudgetCents: project.currentBudgetCents,
        dueDate: project.dueDate,
        status: project.status,
        progress: project.progress,
        priority: project.priority,
        ownerId: project.ownerId,
      },
      OPTIONS,
    )

    expect(result.changed).toBe(false)
    expect(result.version).toBeNull()

    const after = await projectRepository.listVersions(project.id)
    expect(after).toHaveLength(before.length)
  })

  it('keeps a single alert per rule and version across the dataset', async () => {
    const project = await projectRepository.getById('prj_0003')
    expect(project).not.toBeNull()
    if (!project) return

    await projectRepository.update(
      project.id,
      {
        currentBudgetCents: Math.round(project.currentBudgetCents * 1.4),
        dueDate: '2027-02-15',
      },
      OPTIONS,
    )

    const alerts = await alertRepository.getAll()
    const keys = alerts.map(
      (alert) => `${alert.projectId}:${alert.versionId}:${alert.ruleId}`,
    )
    expect(new Set(keys).size).toBe(keys.length)
  })

  it('logs activity when an alert is reviewed', async () => {
    const alerts = await alertRepository.getAll()
    const open = alerts.find((alert) => alert.status === 'open')
    expect(open).toBeDefined()
    if (!open) return

    const updated = await alertRepository.updateStatus(open.id, 'reviewed')
    expect(updated.status).toBe('reviewed')
    expect(updated.reviewedAt).not.toBeNull()

    const activity = await activityRepository.list({
      projectId: open.projectId,
      pageSize: 100,
    })
    expect(
      activity.items.some(
        (entry) =>
          entry.action === 'alert.reviewed' &&
          entry.metadata.alertId === open.id,
      ),
    ).toBe(true)
  })

  it('excludes archived projects from the open alert count', async () => {
    const alerts = await alertRepository.getAll()
    const open = alerts.filter((alert) => alert.status === 'open')
    const target = open[0]
    expect(target).toBeDefined()
    if (!target) return

    const openForProject = open.filter(
      (alert) => alert.projectId === target.projectId,
    ).length
    const before = await alertRepository.countOpen()

    await projectRepository.archive(target.projectId)
    const after = await alertRepository.countOpen()

    expect(after).toBe(before - openForProject)
  })

  it('exposes versions, changes and rule configs through their repositories', async () => {
    const versions = await versionRepository.listByProject('prj_0001')
    const changes = await changeEventRepository.listByProject('prj_0001')
    const rules = await ruleConfigRepository.list()

    expect(versions.length).toBeGreaterThanOrEqual(2)
    expect(changes.length).toBeGreaterThan(0)
    expect(rules).toHaveLength(7)
  })
})
