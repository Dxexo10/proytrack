import {
  Activity,
  Archive,
  CircleCheck,
  Eye,
  FolderPlus,
  GitCommitHorizontal,
  PencilLine,
  TriangleAlert,
  type LucideIcon,
} from 'lucide-react'
import { EmptyState } from '@/components/shared/empty-state'
import type { ActivityLog, Project, User } from '@/domain/models'
import { formatRelative } from '@/domain/utils/date'
import { DEMO_REFERENCE_DATE } from '@/lib/demo-config'
import { describeActivity, SOURCE_LABELS } from '@/lib/labels'
import { cn } from '@/lib/utils'

const ACTION_ICONS: Record<string, LucideIcon> = {
  'project.created': FolderPlus,
  'project.updated': PencilLine,
  'project.archived': Archive,
  'version.created': GitCommitHorizontal,
  'alert.generated': TriangleAlert,
  'alert.reviewed': Eye,
  'alert.resolved': CircleCheck,
}

const ACTION_STYLES: Record<string, string> = {
  'project.created': 'bg-brand-terracotta-subtle text-brand-terracotta-hover',
  'project.updated': 'bg-sand-soft text-text-secondary',
  'project.archived': 'bg-danger-soft text-danger',
  'version.created': 'bg-brand-terracotta-subtle text-brand-terracotta-hover',
  'alert.generated': 'bg-warning-soft text-warning',
  'alert.reviewed': 'bg-info-soft text-info',
  'alert.resolved': 'bg-success-soft text-success',
}

interface ActivityListProps {
  activity: readonly ActivityLog[]
  projects: readonly Project[]
  users: readonly User[]
}

export function ActivityList({ activity, projects, users }: ActivityListProps) {
  if (activity.length === 0) {
    return (
      <EmptyState
        icon={Activity}
        title="Sin actividad para estos filtros"
        description="Los eventos de proyectos, versiones y alertas aparecerán aquí."
      />
    )
  }

  const usersById = new Map(users.map((user) => [user.id, user]))
  const projectsById = new Map(projects.map((project) => [project.id, project]))

  return (
    <ol className="px-5 py-2">
      {activity.map((entry, index) => {
        const Icon = ACTION_ICONS[entry.action] ?? Activity
        const project = entry.projectId
          ? projectsById.get(entry.projectId)
          : undefined
        const actor = entry.actorId ? usersById.get(entry.actorId) : undefined
        const isLast = index === activity.length - 1

        return (
          <li key={entry.id} className="relative flex gap-3 py-3">
            {!isLast ? (
              <span
                aria-hidden="true"
                className="absolute top-10 bottom-[-12px] left-[13px] w-px bg-border"
              />
            ) : null}
            <span
              aria-hidden="true"
              className={cn(
                'relative z-10 mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-lg ring-4 ring-surface',
                ACTION_STYLES[entry.action] ??
                  'bg-sand-soft text-text-secondary',
              )}
            >
              <Icon className="size-3.5" />
            </span>
            <div className="min-w-0 space-y-0.5">
              <p className="text-sm leading-snug text-foreground">
                <span className="font-medium">{actor?.name ?? 'Sistema'}</span>{' '}
                {describeActivity(entry.action, project?.name)}
              </p>
              {entry.metadata.note ? (
                <p className="text-xs text-muted-foreground">
                  “{entry.metadata.note}”
                </p>
              ) : null}
              <p className="text-xs text-muted-foreground">
                {formatRelative(entry.createdAt, DEMO_REFERENCE_DATE)} ·{' '}
                {SOURCE_LABELS[entry.source]}
              </p>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
