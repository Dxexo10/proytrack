import type {
  Alert,
  AlertSeverity,
  ChangeEvent,
  ChangeType,
  Project,
  ProjectVersion,
  User,
  VersionSource,
} from '@/domain/models'

export interface ChangeFeedFilters {
  projectId?: string
  field?: ChangeType | 'all'
  source?: VersionSource | 'all'
  severity?: AlertSeverity | 'all'
  from?: string
  to?: string
  includeArchived?: boolean
}

export interface ChangeFeedItem {
  id: string
  change: ChangeEvent
  version: ProjectVersion
  project: Project
  actor: User | null
  alerts: Alert[]
  severity: AlertSeverity | null
  changedAt: string
}

export interface ChangeFeedResult {
  items: ChangeFeedItem[]
  total: number
  page: number
  pageSize: number
}

export interface BuildChangeFeedInput {
  changes: readonly ChangeEvent[]
  versions: readonly ProjectVersion[]
  alerts: readonly Alert[]
  projects: readonly Project[]
  users: readonly User[]
  filters?: ChangeFeedFilters
  page?: number
  pageSize?: number
}

const SEVERITY_RANK: Record<AlertSeverity, number> = {
  info: 1,
  warning: 2,
  critical: 3,
}

function highestSeverity(alerts: readonly Alert[]): AlertSeverity | null {
  let result: AlertSeverity | null = null

  for (const alert of alerts) {
    if (
      result === null ||
      SEVERITY_RANK[alert.severity] > SEVERITY_RANK[result]
    ) {
      result = alert.severity
    }
  }

  return result
}

export function buildChangeFeed({
  changes,
  versions,
  alerts,
  projects,
  users,
  filters = {},
  page = 1,
  pageSize = 20,
}: BuildChangeFeedInput): ChangeFeedResult {
  const versionById = new Map(versions.map((version) => [version.id, version]))
  const projectById = new Map(projects.map((project) => [project.id, project]))
  const userById = new Map(users.map((user) => [user.id, user]))

  const alertsByVersion = new Map<string, Alert[]>()
  for (const alert of alerts) {
    if (!alert.versionId) continue
    const bucket = alertsByVersion.get(alert.versionId)
    if (bucket) {
      bucket.push(alert)
    } else {
      alertsByVersion.set(alert.versionId, [alert])
    }
  }

  const items: ChangeFeedItem[] = []

  for (const change of changes) {
    const version = versionById.get(change.versionId)
    if (!version) continue

    const project = projectById.get(version.projectId)
    if (!project) continue
    if (!filters.includeArchived && project.archivedAt !== null) continue

    if (filters.projectId && project.id !== filters.projectId) continue
    if (
      filters.field &&
      filters.field !== 'all' &&
      change.field !== filters.field
    ) {
      continue
    }
    if (
      filters.source &&
      filters.source !== 'all' &&
      version.source !== filters.source
    ) {
      continue
    }
    if (filters.from && version.changedAt < filters.from) continue
    if (filters.to && version.changedAt > filters.to) continue

    const versionAlerts = alertsByVersion.get(version.id) ?? []
    const severity = highestSeverity(versionAlerts)

    if (filters.severity && filters.severity !== 'all') {
      if (severity !== filters.severity) continue
    }

    items.push({
      id: change.id,
      change,
      version,
      project,
      actor: userById.get(version.changedBy) ?? null,
      alerts: versionAlerts,
      severity,
      changedAt: version.changedAt,
    })
  }

  items.sort(
    (a, b) =>
      b.changedAt.localeCompare(a.changedAt) ||
      a.change.id.localeCompare(b.change.id),
  )

  const safePage = Math.max(1, page)
  const safePageSize = Math.max(1, pageSize)
  const start = (safePage - 1) * safePageSize

  return {
    items: items.slice(start, start + safePageSize),
    total: items.length,
    page: safePage,
    pageSize: safePageSize,
  }
}
