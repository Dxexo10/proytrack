import type { IDBPDatabase } from 'idb'
import type {
  ProjectUpdateResult,
  UpdateProjectInput,
  UpdateProjectOptions,
} from '@/data/contracts'
import {
  DEFAULT_RULE_CONFIGS,
  type ActivityLog,
  type Alert,
  type ChangeEvent,
  type Project,
  type ProjectVersion,
  type RuleConfig,
} from '@/domain/models'
import { evaluateChangeRules } from '@/domain/services/change-rules'
import { diffProject } from '@/domain/services/project-diff'
import { DEMO_REFERENCE_DATE } from '@/lib/demo-config'
import type { TrazoDB } from '../storage/db'

export async function applyProjectUpdate(
  db: IDBPDatabase<TrazoDB>,
  id: string,
  input: UpdateProjectInput,
  options: UpdateProjectOptions,
): Promise<ProjectUpdateResult> {
  const existing = await db.get('projects', id)

  if (!existing) {
    throw new Error('El proyecto solicitado no existe.')
  }

  const now = options.now ?? new Date().toISOString()
  const updated: Project = { ...existing, ...input, updatedAt: now }
  const drafts = diffProject(existing, updated)

  if (drafts.length === 0) {
    return {
      project: existing,
      changed: false,
      version: null,
      changes: [],
      alerts: [],
    }
  }

  const tx = db.transaction(
    ['projects', 'versions', 'changes', 'alerts', 'activity', 'rules'],
    'readwrite',
  )

  const allVersions = await tx.objectStore('versions').getAll()
  const projectVersions = allVersions.filter(
    (version) => version.projectId === id,
  )
  const versionNumber =
    projectVersions.reduce(
      (max, version) => Math.max(max, version.versionNumber),
      0,
    ) + 1

  const versionId = `ver_${crypto.randomUUID()}`
  const version: ProjectVersion = {
    id: versionId,
    projectId: id,
    versionNumber,
    snapshot: updated,
    changedAt: now,
    changedBy: options.actorId,
    source: options.source,
    reason: options.reason?.trim() ? options.reason.trim() : null,
  }

  const changes: ChangeEvent[] = drafts.map((draft) => ({
    id: `chg_${versionId}_${draft.field}`,
    versionId,
    projectId: id,
    field: draft.field,
    oldValue: draft.oldValue,
    newValue: draft.newValue,
    changeType: draft.field,
  }))

  const storedRules = await tx.objectStore('rules').getAll()
  const ruleConfigs: readonly RuleConfig[] =
    storedRules.length > 0 ? storedRules : DEFAULT_RULE_CONFIGS

  const alertDrafts = evaluateChangeRules({
    previous: existing,
    next: updated,
    ruleConfigs,
    referenceDate: DEMO_REFERENCE_DATE,
    includeTimeRules: true,
  })

  const existingAlerts = await tx.objectStore('alerts').getAll()
  const knownKeys = new Set(
    existingAlerts.map(
      (alert) => `${alert.projectId}:${alert.versionId}:${alert.ruleId}`,
    ),
  )

  const alerts: Alert[] = []

  for (const draft of alertDrafts) {
    const dedupeKey = `${id}:${versionId}:${draft.ruleKey}`
    if (knownKeys.has(dedupeKey)) continue
    knownKeys.add(dedupeKey)

    alerts.push({
      id: `alt_${crypto.randomUUID()}`,
      projectId: id,
      versionId,
      ruleId: draft.ruleKey,
      severity: draft.severity,
      status: 'open',
      title: draft.title,
      description: draft.description,
      createdAt: now,
      reviewedAt: null,
      resolvedAt: null,
    })
  }

  const activity: ActivityLog[] = [
    {
      id: `act_${crypto.randomUUID()}`,
      projectId: id,
      actorId: options.actorId,
      action: 'version.created',
      source: options.source,
      createdAt: now,
      metadata: {
        versionNumber: String(versionNumber),
        fields: String(changes.length),
        reason: options.reason?.trim() ?? '',
      },
    },
    ...alerts.map((alert) => ({
      id: `act_${crypto.randomUUID()}`,
      projectId: id,
      actorId: null,
      action: 'alert.generated',
      source: 'system' as const,
      createdAt: now,
      metadata: {
        ruleId: alert.ruleId,
        severity: alert.severity,
        versionId,
      },
    })),
  ]

  tx.objectStore('projects').put(updated)
  tx.objectStore('versions').put(version)
  for (const change of changes) {
    tx.objectStore('changes').put(change)
  }
  for (const alert of alerts) {
    tx.objectStore('alerts').put(alert)
  }
  for (const entry of activity) {
    tx.objectStore('activity').put(entry)
  }

  await tx.done

  return { project: updated, changed: true, version, changes, alerts }
}
