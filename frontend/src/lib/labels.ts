import type {
  AlertSeverity,
  AlertStatus,
  ActivitySource,
  ProjectPriority,
  ProjectStatus,
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
