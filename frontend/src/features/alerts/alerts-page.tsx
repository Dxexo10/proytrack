import { useState } from 'react'
import { BellRing, ChevronLeft, ChevronRight } from 'lucide-react'
import { DemoBadge } from '@/components/shared/demo-badge'
import { EmptyState } from '@/components/shared/empty-state'
import { ErrorState } from '@/components/shared/error-state'
import { PageHeader } from '@/components/shared/page-header'
import { SectionCard } from '@/components/shared/section-card'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { AlertStatus } from '@/domain/models'
import { formatNumber } from '@/lib/format-number'
import {
  ALERTS_PAGE_SIZE,
  hasActiveAlertFilters,
  useAlertFilters,
} from './hooks/use-alert-filters'
import { useAlertsQuery } from './hooks/use-alerts-query'
import { useUpdateAlertStatus } from './hooks/use-update-alert-status'
import { AlertCounters } from './components/alert-counters'
import { AlertList } from './components/alert-list'
import { AlertsFilters } from './components/alerts-filters'

function AlertsSkeleton() {
  return (
    <Card className="gap-3 p-5" aria-busy="true" aria-live="polite">
      <span className="sr-only">Cargando alertas…</span>
      <Skeleton className="h-5 w-40" />
      <div className="space-y-2 pt-2">
        {Array.from({ length: 5 }, (_, index) => (
          <Skeleton key={index} className="h-20 w-full rounded-xl" />
        ))}
      </div>
    </Card>
  )
}

export function AlertsPage() {
  const { filters, update, clear } = useAlertFilters()
  const query = useAlertsQuery(filters)
  const statusMutation = useUpdateAlertStatus()
  const [pendingId, setPendingId] = useState<string | null>(null)

  const data = query.data
  const total = data?.total ?? 0
  const items = data?.items ?? []
  const counts = data?.counts
  const projects = data ? [...data.projectById.values()] : []
  const totalPages = Math.max(1, Math.ceil(total / ALERTS_PAGE_SIZE))
  const rangeStart = total === 0 ? 0 : (filters.page - 1) * ALERTS_PAGE_SIZE + 1
  const rangeEnd = Math.min(total, filters.page * ALERTS_PAGE_SIZE)
  const active = hasActiveAlertFilters(filters)

  const handleStatusChange = (id: string, status: AlertStatus) => {
    setPendingId(id)
    statusMutation.mutate(
      { id, status },
      { onSettled: () => setPendingId(null) },
    )
  }

  return (
    <div className="space-y-5 lg:space-y-6">
      <PageHeader
        title="Centro de alertas"
        description="Señales explicables generadas por reglas de negocio, con su proyecto y trazabilidad."
        meta={
          <div className="flex flex-wrap items-center gap-2">
            <DemoBadge />
            <span className="text-xs text-muted-foreground">
              {query.isPending
                ? 'Cargando alertas…'
                : `${formatNumber(counts?.open ?? 0)} abiertas de ${formatNumber(
                    (counts?.open ?? 0) +
                      (counts?.reviewed ?? 0) +
                      (counts?.resolved ?? 0),
                  )}`}
            </span>
          </div>
        }
      />

      {query.isError ? (
        <ErrorState
          message={
            query.error instanceof Error
              ? query.error.message
              : 'No pudimos cargar el centro de alertas.'
          }
          onRetry={() => void query.refetch()}
        />
      ) : null}

      {query.isPending ? <AlertsSkeleton /> : null}

      {data ? (
        <>
          <AlertCounters counts={data.counts} />

          <AlertsFilters
            filters={filters}
            projects={projects}
            onChange={update}
            onClear={clear}
          />

          <SectionCard
            title={`${formatNumber(total)} ${total === 1 ? 'alerta' : 'alertas'}`}
            description={
              active
                ? 'Resultados con los filtros activos.'
                : 'Todas las alertas del portafolio activo.'
            }
            action={
              <span className="rounded-md bg-sand-soft px-2 py-1 text-xs text-muted-foreground">
                {formatNumber(ALERTS_PAGE_SIZE)} por página
              </span>
            }
          >
            {items.length === 0 ? (
              <EmptyState
                icon={BellRing}
                title="Sin alertas para estos filtros"
                description="Prueba con otro estado, severidad, proyecto o periodo."
                action={
                  active ? (
                    <Button variant="outline" size="sm" onClick={clear}>
                      Limpiar filtros
                    </Button>
                  ) : undefined
                }
              />
            ) : (
              <>
                <AlertList
                  alerts={items}
                  projectById={data.projectById}
                  pendingId={pendingId}
                  onStatusChange={handleStatusChange}
                />

                {total > 0 ? (
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-3">
                    <p className="text-xs text-muted-foreground">
                      Mostrando {rangeStart}–{rangeEnd} de {formatNumber(total)}
                    </p>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={filters.page <= 1}
                        onClick={() => update({ page: filters.page - 1 })}
                      >
                        <ChevronLeft aria-hidden="true" className="size-3.5" />
                        Anterior
                      </Button>
                      <span className="text-xs tabular-nums text-muted-foreground">
                        Página {filters.page} de {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={filters.page >= totalPages}
                        onClick={() => update({ page: filters.page + 1 })}
                      >
                        Siguiente
                        <ChevronRight aria-hidden="true" className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                ) : null}
              </>
            )}
          </SectionCard>
        </>
      ) : null}
    </div>
  )
}
