import { ArrowLeft, Compass } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { PageHeader } from '@/components/shared/page-header'

export function NotFoundPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Página no encontrada"
        description="La ruta que buscas no existe en esta demo de ProyTrack."
      />
      <Card className="gap-5 p-8 text-center">
        <span className="mx-auto inline-flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Compass aria-hidden="true" className="size-6" />
        </span>
        <div className="space-y-1">
          <p className="text-4xl font-semibold tracking-tight text-foreground">
            404
          </p>
          <p className="text-sm text-muted-foreground">
            Revisa la dirección o vuelve al resumen general para continuar
            explorando el portafolio.
          </p>
        </div>
        <div className="flex justify-center">
          <Button render={<Link to="/dashboard" />}>
            <ArrowLeft aria-hidden="true" className="size-4" />
            Volver al resumen general
          </Button>
        </div>
      </Card>
    </div>
  )
}
