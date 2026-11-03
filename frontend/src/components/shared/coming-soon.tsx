import type { ReactNode } from 'react'
import { ArrowLeft, Construction, type LucideIcon } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PageHeader } from '@/components/shared/page-header'
import { DemoBadge } from '@/components/shared/demo-badge'

interface ComingSoonProps {
  title: string
  description: string
  phase: string
  icon?: LucideIcon
  plannedFeatures: string[]
  children?: ReactNode
}

export function ComingSoon({
  title,
  description,
  phase,
  icon: Icon = Construction,
  plannedFeatures,
}: ComingSoonProps) {
  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        description={description}
        actions={<DemoBadge />}
      />

      <Card className="gap-5 p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <span
            aria-hidden="true"
            className="inline-flex size-11 shrink-0 items-center justify-center rounded-xl bg-warning-soft text-warning"
          >
            <Icon className="size-5" />
          </span>
          <div className="space-y-1">
            <p className="text-base font-semibold text-foreground">
              Este módulo llega en la {phase.toLowerCase()}
            </p>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Preferimos no mostrar una pantalla vacía ni simular una
              funcionalidad que aún no existe. Esto es lo que estamos
              construyendo aquí:
            </p>
          </div>
        </div>

        <ul className="grid gap-2 sm:grid-cols-2">
          {plannedFeatures.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2 text-sm text-foreground"
            >
              <span
                aria-hidden="true"
                className="mt-1.5 size-1.5 shrink-0 rounded-full bg-brand-terracotta"
              />
              {feature}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" render={<Link to="/dashboard" />}>
            <ArrowLeft aria-hidden="true" className="size-4" />
            Volver al resumen
          </Button>
        </div>
      </Card>
    </div>
  )
}
