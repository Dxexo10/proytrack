import { Link } from 'react-router-dom'
import { AlertStatusBadge } from '@/components/shared/alert-status-badge'
import { SeverityBadge } from '@/components/shared/severity-badge'
import { Button } from '@/components/ui/button'
import type { Alert, AlertStatus, Project, RuleKey } from '@/domain/models'
import { formatRelative } from '@/domain/utils/date'
import { DEMO_REFERENCE_DATE } from '@/lib/demo-config'
import { RULE_LABELS } from '@/lib/labels'

interface AlertListProps {
  alerts: readonly Alert[]
  projectById: Map<string, Project>
  pendingId: string | null
  onStatusChange: (id: string, status: AlertStatus) => void
}

export function AlertList({
  alerts,
  projectById,
  pendingId,
  onStatusChange,
}: AlertListProps) {
  return (
    <ul className="divide-y divide-border">
      {alerts.map((alert) => {
        const project = projectById.get(alert.projectId)
        const rule = RULE_LABELS[alert.ruleId as RuleKey]
        const canReview = alert.status === 'open'
        const canResolve = alert.status !== 'resolved'
        const isPending = pendingId === alert.id

        return (
          <li
            key={alert.id}
            className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-start"
          >
            <div className="flex min-w-0 flex-1 gap-3">
              <SeverityBadge
                severity={alert.severity}
                showLabel={false}
                className="mt-0.5 shrink-0"
              />
              <div className="min-w-0 space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium text-foreground">
                    {alert.title}
                  </p>
                  <AlertStatusBadge status={alert.status} />
                </div>
                <p className="text-xs leading-relaxed text-muted-foreground">
                  {alert.description}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  Proyecto:{' '}
                  <Link
                    to={`/projects/${alert.projectId}?tab=historial`}
                    className="font-medium text-brand-terracotta-hover hover:underline"
                  >
                    {project?.name ?? 'Ver proyecto'}
                  </Link>{' '}
                  · Regla: {rule?.label ?? alert.ruleId} ·{' '}
                  {formatRelative(alert.createdAt, DEMO_REFERENCE_DATE)}
                </p>
              </div>
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
              <Button
                variant="ghost"
                size="sm"
                render={
                  <Link to={`/projects/${alert.projectId}?tab=historial`} />
                }
              >
                Ver proyecto
              </Button>
              {canReview ? (
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isPending}
                  onClick={() => onStatusChange(alert.id, 'reviewed')}
                >
                  Revisar
                </Button>
              ) : null}
              {canResolve ? (
                <Button
                  size="sm"
                  disabled={isPending}
                  onClick={() => onStatusChange(alert.id, 'resolved')}
                >
                  Resolver
                </Button>
              ) : null}
            </div>
          </li>
        )
      })}
    </ul>
  )
}
