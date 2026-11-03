import { Link } from 'react-router-dom'
import { ArrowUpRight, Eye, PencilLine } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PriorityBadge } from '@/components/shared/priority-badge'
import { ProgressBar } from '@/components/shared/progress-bar'
import { StatusBadge } from '@/components/shared/status-badge'
import { UserChip } from '@/components/shared/user-chip'
import type { Project, User } from '@/domain/models'
import { formatDate } from '@/domain/utils/date'
import { formatCurrency } from '@/domain/utils/money'
import { ArchiveProjectButton } from './archive-project-button'

interface ProjectMobileListProps {
  projects: Project[]
  users: readonly User[]
}

export function ProjectMobileList({ projects, users }: ProjectMobileListProps) {
  const usersById = new Map(users.map((user) => [user.id, user]))

  return (
    <ul className="space-y-3 p-4">
      {projects.map((project) => {
        const owner = usersById.get(project.ownerId)

        return (
          <li key={project.id}>
            <Card className="gap-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Link
                    to={`/projects/${project.id}`}
                    className="flex items-center gap-1 font-medium text-foreground hover:text-brand-terracotta-hover"
                  >
                    <span className="truncate">{project.name}</span>
                    <ArrowUpRight
                      aria-hidden="true"
                      className="size-3.5 shrink-0"
                    />
                  </Link>
                  <p className="text-xs text-muted-foreground">
                    {project.code} · {project.client}
                  </p>
                </div>
                {project.archivedAt ? (
                  <span className="shrink-0 rounded-full border border-border bg-sand-soft px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                    Archivado
                  </span>
                ) : null}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={project.status} />
                <PriorityBadge priority={project.priority} />
                {owner ? <UserChip name={owner.name} /> : null}
              </div>

              <ProgressBar
                value={project.progress}
                showLabel
                label={`Avance de ${project.name}`}
              />

              <dl className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <dt className="text-muted-foreground">Presupuesto</dt>
                  <dd className="font-medium tabular-nums text-foreground">
                    {formatCurrency(project.currentBudgetCents)}
                  </dd>
                </div>
                <div>
                  <dt className="text-muted-foreground">Entrega</dt>
                  <dd className="font-medium tabular-nums text-foreground">
                    {formatDate(project.dueDate)}
                  </dd>
                </div>
              </dl>

              <div className="flex flex-wrap items-center gap-1 border-t border-border pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  render={<Link to={`/projects/${project.id}`} />}
                >
                  <Eye aria-hidden="true" className="size-3.5" />
                  Ver
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  render={<Link to={`/projects/${project.id}/edit`} />}
                >
                  <PencilLine aria-hidden="true" className="size-3.5" />
                  Editar
                </Button>
                {project.archivedAt ? null : (
                  <ArchiveProjectButton project={project} />
                )}
              </div>
            </Card>
          </li>
        )
      })}
    </ul>
  )
}
