import { useState } from 'react'
import { ChevronLeft, ChevronRight, Radar } from 'lucide-react'
import { DemoBadge } from '@/components/shared/demo-badge'
import { EmptyState } from '@/components/shared/empty-state'
import { ErrorState } from '@/components/shared/error-state'
import { PageHeader } from '@/components/shared/page-header'
import { SectionCard } from '@/components/shared/section-card'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import type { ChangeFeedItem } from '@/domain/services/change-feed'
import { formatNumber } from '@/lib/format-number'
import { useChangeFeed, useMonitorProjects } from './hooks/use-change-feed'
import {
  hasActiveMonitorFilters,
  MONITOR_PAGE_SIZE,
  useMonitorFilters,
} from './hooks/use-monitor-filters'
import { ChangeDetailSheet } from './components/change-detail-sheet'
import { ChangeFeedList } from './components/change-feed-list'
import { MonitorFilters } from './components/monitor-filters'

function MonitorSkeleton() {
  return (
    <Card className="gap-3 p-5" aria-busy="true" aria-live="polite">
      <span className="sr-only">Cargando cambios…</span>
      <Skeleton className="h-5 w-40" />
      <div className="space-y-2 pt-2">
        {Array.from({ length: 6 }, (_, index) => (
          <Skeleton key={index} className="h-14 w-full rounded-xl" />
        ))}
      </div>
    </Card>
  )
}

export function MonitorPage() {
  const { filters, update, clear } = useMonitorFilters()
  const feedQuery = useChangeFeed(filters)
  const projectsQuery = useMonitorProjects()
  const [selected, setSelected] = useState<ChangeFeedItem | null>(null)

  const total = feedQuery.data?.total ?? 0
  const items = feedQuery.data?.items ?? []
  const totalPages = Math.max(1, Math.ceil(total / MONITOR_PAGE_SIZE))
  const rangeStart =
    total === 0 ? 0 : (filters.page - 1) * MONITOR_PAGE_SIZE + 1
  const rangeEnd = Math.min(total, filters.page * MONITOR_PAGE_SIZE)
  const active = hasActiveMonitorFilters(filters)

  return (
    <div className="space-y-5 lg:space-y-6">
      <PageHeader
        title="Monitor de cambios"
        description="Cada modificación relevante del portafolio, con su versión, autor y regla asociada."
        meta={
          <div className="flex flex-wrap items-center gap-2">
            <DemoBadge />
            <span className="text-xs text-muted-foreground">
              {feedQuery.isPending
                ? 'Cargando cambios…'
                : `${formatNumber(total)} ${total === 1 ? 'cambio' : 'cambios'}`}
            </span>
          </div>
        }
      />

      <MonitorFilters
        filters={filters}
        projects={projectsQuery.data ?? []}
        onChange={update}
        onClear={clear}
      />

      {feedQuery.isError ? (
        <ErrorState
          message={
            feedQuery.error instanceof Error
              ? feedQuery.error.message
              : 'No pudimos cargar el monitor de cambios.'
          }
          onRetry={() => void feedQuery.refetch()}
        />
      ) : null}

      {feedQuery.isPending ? <MonitorSkeleton /> : null}

      {feedQuery.data ? (
        <SectionCard
          title={`${formatNumber(total)} ${total === 1 ? 'cambio registrado' : 'cambios registrados'}`}
          description={
            active
              ? 'Resultados con los filtros activos.'
              : 'Historial de versiones del portafolio activo.'
          }
          action={
            <span className="rounded-md bg-sand-soft px-2 py-1 text-xs text-muted-foreground">
              {formatNumber(MONITOR_PAGE_SIZE)} por página
            </span>
          }
        >
          {items.length === 0 ? (
            <EmptyState
              icon={Radar}
              title="Sin cambios para estos filtros"
              description="Prueba con otro periodo, proyecto o campo auditado."
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
              <ChangeFeedList items={items} onSelect={setSelected} />

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
      ) : null}

      <ChangeDetailSheet item={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
