import type {
  ActivityLog,
  Alert,
  Project,
  ProjectVersion,
} from '@/domain/models'
import { parseDate } from '@/domain/utils/date'
import { createRandom, pick, randomInt } from './random'
import { DEMO_CURRENT_USER, DEMO_USERS } from './users'

const MANUAL_NOTES = [
  'Ajustó el cronograma tras la reunión de seguimiento.',
  'Actualizó el avance reportado por el equipo de obra.',
  'Revisó el presupuesto con el área financiera.',
  'Documentó el riesgo de proveedor en el acta semanal.',
  'Confirmó la entrega parcial con el cliente.',
]

export function generateActivity(
  random: () => number,
  projects: readonly Project[],
  alerts: readonly Alert[],
  versions: readonly ProjectVersion[],
): ActivityLog[] {
  const activity: ActivityLog[] = []
  const fallbackRandom = createRandom(9_815_223)

  const push = (entry: Omit<ActivityLog, 'id'>) => {
    activity.push({
      id: `act_${String(activity.length + 1).padStart(4, '0')}`,
      ...entry,
    })
  }

  for (const project of projects) {
    push({
      projectId: project.id,
      actorId: project.ownerId,
      action: 'project.created',
      source: 'system',
      createdAt: project.createdAt,
      metadata: { code: project.code },
    })

    push({
      projectId: project.id,
      actorId: project.ownerId,
      action: 'project.updated',
      source: 'simulated',
      createdAt: project.updatedAt,
      metadata: { status: project.status },
    })
  }

  for (const version of versions) {
    push({
      projectId: version.projectId,
      actorId: version.changedBy,
      action: 'version.created',
      source: version.source,
      createdAt: version.changedAt,
      metadata: {
        versionNumber: String(version.versionNumber),
        reason: version.reason ?? '',
      },
    })
  }

  for (const alert of alerts) {
    push({
      projectId: alert.projectId,
      actorId: null,
      action: 'alert.generated',
      source: 'system',
      createdAt: alert.createdAt,
      metadata: {
        ruleId: alert.ruleId,
        severity: alert.severity,
        versionId: alert.versionId ?? '',
      },
    })
  }

  for (let index = 0; index < MANUAL_NOTES.length; index += 1) {
    const project = pick(random, projects)
    const actor = pick(fallbackRandom, DEMO_USERS)
    push({
      projectId: project.id,
      actorId: actor.id,
      action: index % 2 === 0 ? 'project.updated' : 'alert.reviewed',
      source: 'manual',
      createdAt: new Date(
        parseDate(project.updatedAt).getTime() -
          randomInt(random, 1, 6) * 86_400_000,
      ).toISOString(),
      metadata: { note: MANUAL_NOTES[index] as string },
    })
  }

  push({
    projectId: null,
    actorId: DEMO_CURRENT_USER.id,
    action: 'alert.resolved',
    source: 'manual',
    createdAt: new Date(
      parseDate(projects[0]?.updatedAt ?? new Date().toISOString()).getTime() -
        2 * 86_400_000,
    ).toISOString(),
    metadata: {},
  })

  return activity.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}
