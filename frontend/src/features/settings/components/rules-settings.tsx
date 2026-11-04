import { useState } from 'react'
import { ErrorState } from '@/components/shared/error-state'
import { SectionCard } from '@/components/shared/section-card'
import { SeverityBadge } from '@/components/shared/severity-badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Skeleton } from '@/components/ui/skeleton'
import { Switch } from '@/components/ui/switch'
import type { RuleConfig } from '@/domain/models'
import { RULE_LABELS } from '@/lib/labels'
import { useRuleConfigs, useSaveRuleConfigs } from '../hooks/use-rule-configs'

function thresholdUnit(ruleKey: RuleConfig['ruleKey']): string {
  return ruleKey.startsWith('budget') ? '%' : 'días'
}

function RulesForm({ configs }: { configs: RuleConfig[] }) {
  const [drafts, setDrafts] = useState<RuleConfig[]>(() =>
    configs.map((config) => ({ ...config })),
  )
  const save = useSaveRuleConfigs()

  const update = (id: string, patch: Partial<RuleConfig>) => {
    setDrafts((current) =>
      current.map((config) =>
        config.id === id ? { ...config, ...patch } : config,
      ),
    )
  }

  return (
    <SectionCard
      title="Reglas de alerta"
      description="Umbrales y severidades que se aplican a las próximas versiones."
      action={
        <Button
          size="sm"
          disabled={save.isPending}
          onClick={() => save.mutate({ configs: drafts })}
        >
          {save.isPending ? 'Guardando…' : 'Guardar reglas'}
        </Button>
      }
    >
      <ul className="divide-y divide-border">
        {drafts.map((config) => {
          const rule = RULE_LABELS[config.ruleKey]

          return (
            <li
              key={config.id}
              className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center"
            >
              <div className="min-w-0 flex-1 space-y-0.5">
                <p className="text-sm font-medium text-foreground">
                  {rule.label}
                </p>
                <p className="text-xs text-muted-foreground">
                  {rule.description}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <SeverityBadge severity={config.severity} />
                {config.threshold !== null ? (
                  <div className="flex items-center gap-1.5">
                    <Label
                      htmlFor={`threshold-${config.id}`}
                      className="text-xs text-muted-foreground"
                    >
                      Umbral
                    </Label>
                    <Input
                      id={`threshold-${config.id}`}
                      type="number"
                      min={0}
                      value={config.threshold}
                      onChange={(event) =>
                        update(config.id, {
                          threshold:
                            event.target.value === ''
                              ? null
                              : Number(event.target.value),
                        })
                      }
                      className="h-8 w-20"
                    />
                    <span className="text-xs text-muted-foreground">
                      {thresholdUnit(config.ruleKey)}
                    </span>
                  </div>
                ) : null}
                <Switch
                  checked={config.enabled}
                  onCheckedChange={(checked) =>
                    update(config.id, { enabled: Boolean(checked) })
                  }
                  aria-label={`Activar ${rule.label}`}
                />
              </div>
            </li>
          )
        })}
      </ul>
    </SectionCard>
  )
}

export function RulesSettings() {
  const query = useRuleConfigs()

  if (query.isPending) {
    return (
      <SectionCard
        title="Reglas de alerta"
        description="Cargando configuración…"
      >
        <div
          className="space-y-2 px-5 pb-5"
          aria-busy="true"
          aria-live="polite"
        >
          <span className="sr-only">Cargando reglas…</span>
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-14 w-full rounded-xl" />
          ))}
        </div>
      </SectionCard>
    )
  }

  if (query.isError) {
    return (
      <ErrorState
        message={
          query.error instanceof Error
            ? query.error.message
            : 'No pudimos cargar las reglas.'
        }
        onRetry={() => void query.refetch()}
      />
    )
  }

  return <RulesForm key={query.dataUpdatedAt} configs={query.data ?? []} />
}
