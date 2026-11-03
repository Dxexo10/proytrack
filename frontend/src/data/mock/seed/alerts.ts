import type { Alert, AlertSeverity, AlertStatus, Project } from '@/domain/models'
import { daysBetween, parseDate } from '@/domain/utils/date'
import { percentageChange } from '@/domain/utils/money'
import { DEMO_REFERENCE_DATE } from '@/lib/demo-config'
import { randomInt } from './random'

const ACTIVE_STATUSES = new Set(['in_progress', 'on_hold'])

interface AlertDraft {
  ruleId: string
  severity: AlertSeverity
  title: string
  description: string
}

function budgetAlert(project: Project): AlertDraft | null {
  const variation = percentageChange(
    project.initialBudgetCents,
    project.currentBudgetCents,
  )

  if (project.initialBudgetCents === 0 && project.currentBudgetCents > 0) {
    return {
      ruleId: 'budget-increase-from-zero',
      severity: 'critical',
      title: 'Presupuesto asignado desde cero',
      description:
        'El proyecto no tenía presupuesto inicial y ahora registra un monto asignado.',
    }
  }

  if (variation === null) return null

  if (variation > 20) {
    return {
      ruleId: 'budget-increase-critical',
      severity: 'critical',
      title: 'Incremento presupuestal crítico',
      description: `El presupuesto actual aumentó un ${variation.toFixed(1).replace('.', ',')} % respecto a la línea base.`,
    }
  }

  if (variation > 10) {
    return {
      ruleId: 'budget-increase-warning',
      severity: 'warning',
      title: 'Incremento presupuestal relevante',
      description: `El presupuesto actual aumentó un ${variation.toFixed(1).replace('.', ',')} % respecto a la línea base.`,
    }
  }

  return null
}

function deadlineAlert(
  project: Project,
  referenceDate: string,
): AlertDraft | null {
  if (!ACTIVE_STATUSES.has(project.status)) return null

  const overdueDays = daysBetween(project.dueDate, referenceDate)
  if (overdueDays <= 0) return null

  return {
    ruleId: 'project-overdue',
    severity: 'warning',
    title: 'Proyecto vencido',
    description: `La fecha de entrega venció hace ${overdueDays} días con un avance del ${project.progress} %.`,
  }
}

function statusAlert(project: Project): AlertDraft | null {
  if (project.status !== 'on_hold') return null
  return {
    ruleId: 'project-on-hold',
    severity: 'critical',
    title: 'Proyecto bloqueado',
    description:
      'El estado del proyecto cambió a Bloqueado y requiere seguimiento del responsable.',
  }
}

function priorityAlert(project: Project): AlertDraft | null {
  if (project.priority !== 'critical') return null
  return {
    ruleId: 'priority-critical',
    severity: 'warning',
    title: 'Prioridad crítica asignada',
    description:
      'El proyecto pasó a prioridad crítica y debe revisarse en la reunión de portafolio.',
  }
}

function statusFor(index: number): AlertStatus {
  if (index % 7 === 0) return 'resolved'
  if (index % 5 === 0) return 'reviewed'
  return 'open'
}

export function generateAlerts(
  random: () => number,
  projects: readonly Project[],
): Alert[] {
  const reference = parseDate(DEMO_REFERENCE_DATE)
  const alerts: Alert[] = []

  for (const project of projects) {
    if (project.status === 'cancelled') continue

    const drafts = [
      budgetAlert(project),
      deadlineAlert(project, DEMO_REFERENCE_DATE),
      statusAlert(project),
      priorityAlert(project),
    ].filter((draft): draft is AlertDraft => draft !== null)

    for (const draft of drafts) {
      const status = statusFor(alerts.length)
      const createdAt = new Date(
        parseDate(project.updatedAt).getTime() + randomInt(random, 0, 5) * 3_600_000,
      )
      const createdAtIsFuture = createdAt > reference
      const createdAtIso = (createdAtIsFuture
        ? new Date(reference.getTime() - randomInt(random, 1, 30) * 3_600_000)
        : createdAt
      ).toISOString()

      const reviewedAt =
        status === 'open'
          ? null
          : new Date(
              Math.min(
                reference.getTime(),
                parseDate(createdAtIso).getTime() +
                  randomInt(random, 4, 72) * 3_600_000,
              ),
            ).toISOString()

      alerts.push({
        id: `alt_${String(alerts.length + 1).padStart(4, '0')}`,
        projectId: project.id,
        ruleId: draft.ruleId,
        severity: draft.severity,
        status,
        title: draft.title,
        description: draft.description,
        createdAt: createdAtIso,
        reviewedAt,
        resolvedAt: status === 'resolved' ? reviewedAt : null,
      })
    }
  }

  return alerts.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}
