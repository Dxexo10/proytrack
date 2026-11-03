import type {
  AlertSeverity,
  AlertStatus,
  ActivitySource,
  ChangeType,
  ProjectPriority,
  ProjectStatus,
  RuleKey,
  Sector,
  UserRole,
} from '@/domain/models'

export const STATUS_LABELS: Record<ProjectStatus, string> = {
  planned: 'Planificado',
  in_progress: 'En ejecución',
  on_hold: 'Bloqueado',
  completed: 'Completado',
  cancelled: 'Cancelado',
}

export const PRIORITY_LABELS: Record<ProjectPriority, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
  critical: 'Crítica',
}

export const SECTOR_LABELS: Record<Sector, string> = {
  technology: 'Tecnología',
  construction: 'Construcción',
  consulting: 'Consultoría',
}

export const SEVERITY_LABELS: Record<AlertSeverity, string> = {
  info: 'Informativa',
  warning: 'Advertencia',
  critical: 'Crítica',
}

export const ALERT_STATUS_LABELS: Record<AlertStatus, string> = {
  open: 'Abierta',
  reviewed: 'Revisada',
  resolved: 'Resuelta',
}

export const SOURCE_LABELS: Record<ActivitySource, string> = {
  simulated: 'Simulado',
  manual: 'Manual',
  system: 'Sistema',
}

export const CHANGE_FIELD_LABELS: Record<ChangeType, string> = {
  budget: 'Presupuesto',
  deadline: 'Fecha de entrega',
  status: 'Estado',
  progress: 'Avance',
  priority: 'Prioridad',
  owner: 'Responsable',
}

export const RULE_LABELS: Record<
  RuleKey,
  { label: string; description: string }
> = {
  'budget-increase-from-zero': {
    label: 'Presupuesto desde cero',
    description:
      'El proyecto pasó de no tener presupuesto registrado a un monto asignado.',
  },
  'budget-increase-critical': {
    label: 'Incremento presupuestal crítico',
    description:
      'El presupuesto actual subió más de 20 % respecto a la versión anterior.',
  },
  'budget-increase-warning': {
    label: 'Incremento presupuestal relevante',
    description:
      'El presupuesto actual subió más de 10 % respecto a la versión anterior.',
  },
  'deadline-postponed': {
    label: 'Fecha de entrega postergada',
    description:
      'La nueva fecha de entrega es posterior a la registrada en la versión anterior.',
  },
  'project-overdue': {
    label: 'Proyecto vencido',
    description:
      'La fecha de entrega pasó la referencia y el proyecto sigue activo.',
  },
  'project-on-hold': {
    label: 'Proyecto bloqueado',
    description: 'El estado del proyecto cambió a Bloqueado.',
  },
  'priority-critical': {
    label: 'Prioridad crítica',
    description: 'La prioridad del proyecto cambió a Crítica.',
  },
}

export const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Administrador',
  manager: 'Gerente de proyectos',
  analyst: 'Analista',
  viewer: 'Lector',
}

export const ACTIVITY_ACTION_LABELS: Record<string, string> = {
  'project.created': 'creó el proyecto',
  'project.updated': 'actualizó el proyecto',
  'project.archived': 'archivó el proyecto',
  'version.created': 'registró una nueva versión de',
  'alert.generated': 'generó una alerta en',
  'alert.reviewed': 'revisó una alerta de',
  'alert.resolved': 'resolvió una alerta de',
}

export function describeActivity(
  action: string,
  projectName: string | undefined,
): string {
  const verb = ACTIVITY_ACTION_LABELS[action] ?? action
  return projectName ? `${verb} ${projectName}` : verb
}
