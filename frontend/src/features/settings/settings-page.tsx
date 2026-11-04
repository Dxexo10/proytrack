import { Database, ShieldCheck, UserRound } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DemoBadge } from '@/components/shared/demo-badge'
import { PageHeader } from '@/components/shared/page-header'
import { SectionCard } from '@/components/shared/section-card'
import { DEMO_CURRENT_USER } from '@/data/mock/seed/users'
import { initials } from '@/domain/utils/format'
import { formatDate } from '@/domain/utils/date'
import {
  DEMO_REFERENCE_DATE,
  DEMO_SCHEMA_VERSION,
  DEMO_SEED_VERSION,
} from '@/lib/demo-config'
import { ROLE_LABELS } from '@/lib/labels'
import { ResetDemoButton } from './components/reset-demo-button'
import { RulesSettings } from './components/rules-settings'

export function SettingsPage() {
  return (
    <div className="space-y-5 lg:space-y-6">
      <PageHeader
        title="Configuración demo"
        description="Perfil fijo, reglas del motor y control del dataset simulado."
        meta={<DemoBadge />}
        actions={<ResetDemoButton />}
      />

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="space-y-4">
          <SectionCard
            title="Perfil demo"
            description="Identidad fija del entorno simulado."
          >
            <div className="flex items-center gap-3 px-5 pb-4">
              <Avatar size="lg">
                <AvatarFallback className="bg-brand-terracotta/15 text-sm font-semibold text-brand-terracotta-hover">
                  {initials(DEMO_CURRENT_USER.name)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {DEMO_CURRENT_USER.name}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {DEMO_CURRENT_USER.email}
                </p>
                <p className="pt-0.5 text-xs text-muted-foreground">
                  {ROLE_LABELS[DEMO_CURRENT_USER.role]}
                </p>
              </div>
            </div>
            <div className="flex items-start gap-2 border-t border-border px-5 py-3 text-xs text-muted-foreground">
              <ShieldCheck
                aria-hidden="true"
                className="mt-0.5 size-4 shrink-0"
              />
              Perfil de demostración: no hay autenticación, permisos ni
              multiempresa reales.
            </div>
          </SectionCard>

          <SectionCard
            title="Dataset demo"
            description="Versión del estado simulado persistido en IndexedDB."
          >
            <dl className="grid grid-cols-2 gap-3 px-5 pb-5 text-sm">
              <div>
                <dt className="text-xs text-muted-foreground">Semilla</dt>
                <dd className="pt-0.5 font-medium tabular-nums text-foreground">
                  {DEMO_SEED_VERSION}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Esquema</dt>
                <dd className="pt-0.5 font-medium tabular-nums text-foreground">
                  {DEMO_SCHEMA_VERSION}
                </dd>
              </div>
              <div className="col-span-2">
                <dt className="text-xs text-muted-foreground">
                  Fecha de referencia
                </dt>
                <dd className="pt-0.5 flex items-center gap-1.5 font-medium text-foreground">
                  <Database
                    aria-hidden="true"
                    className="size-3.5 text-muted-foreground"
                  />
                  {formatDate(DEMO_REFERENCE_DATE)}
                </dd>
              </div>
            </dl>
          </SectionCard>
        </div>

        <div className="xl:col-span-2">
          <RulesSettings />
        </div>
      </div>

      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <UserRound aria-hidden="true" className="size-3.5" />
        Los cambios de reglas afectan a las versiones futuras; el historial
        existente no se recalcula.
      </p>
    </div>
  )
}
