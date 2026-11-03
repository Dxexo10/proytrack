import {
  Activity,
  CircleCheck,
  Eye,
  FolderPlus,
  PencilLine,
  TriangleAlert,
  type LucideIcon,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { EmptyState } from '@/components/shared/empty-state'
import { SectionCard } from '@/components/shared/section-card'
import { Button } from '@/components/ui/button'
import type { ActivityLog, Project, User } from '@/domain/models'
import { formatRelative } from '@/domain/utils/date'
import { DEMO_REFERENCE_DATE } from '@/lib/demo-config'
import { describeActivity, SOURCE_LABELS } from '@/lib/labels'

const ACTION_ICONS: Record<string, LucideIcon> = {
  'project.created': FolderPlus,
  'project.updated': PencilLine,
  'alert.generated': TriangleAlert,
  'alert.reviewed': Eye,
  'alert.resolved': CircleCheck,
}

const ACTION_STYLES: Record<string, string> = {
  'project.created': 'bg-blue-50 text-blue-600',
  'project.updated': 'bg-slate-100 text-slate-600',
  'alert.generated': 'bg-amber-50 text-amber-600',
  'alert.reviewed': 'bg-indigo-50 text-indigo-600',
  'alert.resolved': 'bg-emerald-50 text-emerald-600',
}

interface RecentActivityProps {
  activity: ActivityLog[]
  projects: Project[]
  users: User[]
}

export function RecentActivity({ activity, projects, users }: RecentActivityProps) {
  const usersById = new Map(users.map((user) => [user.id, user]))
  const projectsById = new Map(projects.map((project) => [project.id, project]))

  return (
    <SectionCard
      title="Actividad reciente"
      description="Últimos eventos registrados en el entorno demo."
      action={
        <Button variant="ghost" size="sm" render={<Link to="/activity" />}>
          Historial
        </Button>
      }
    >
      {activity.length === 0 ? (
        <EmptyState
          icon={Activity}
          title="Sin actividad reciente"
          description="Los cambios en proyectos y alertas aparecerán aquí."
        />
      ) : (
        <ol className="divide-y divide-border">
          {activity.slice(0, 6).map((entry) => {
            const Icon = ACTION_ICONS[entry.action] ?? Activity
            const project = entry.projectId
              ? projectsById.get(entry.projectId)
              : undefined
            const actor = entry.actorId
              ? usersById.get(entry.actorId)
              : undefined

            return (
              <li key={entry.id} className="flex gap-3 px-5 py-3">
                <span
                  aria-hidden="true"
                  className={`mt-0.5 inline-flex size-7 shrink-0 items-center justify-center rounded-lg ${ACTION_STYLES[entry.action] ?? 'bg-slate-100 text-slate-600'}`}
                >
                  <Icon className="size-3.5" />
                </span>
                <div className="min-w-0 space-y-0.5">
                  <p className="text-sm leading-snug text-foreground">
                    <span className="font-medium">
                      {actor?.name ?? 'Sistema'}
                    </span>{' '}
                    {describeActivity(entry.action, project?.name)}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {formatRelative(entry.createdAt, DEMO_REFERENCE_DATE)} ·{' '}
                    {SOURCE_LABELS[entry.source]}
                  </p>
                </div>
              </li>
            )
          })}
        </ol>
      )}
    </SectionCard>
  )
}
