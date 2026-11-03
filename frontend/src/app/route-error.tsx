import { AlertTriangle } from 'lucide-react'
import { isRouteErrorResponse, useRouteError } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export function RouteError() {
  const error = useRouteError()

  const message = isRouteErrorResponse(error)
    ? `${error.status} · ${error.statusText}`
    : error instanceof Error
      ? error.message
      : 'Ocurrió un error inesperado al renderizar esta pantalla.'

  return (
    <div className="flex min-h-[60svh] items-center justify-center px-4">
      <div
        role="alert"
        className="w-full max-w-lg rounded-2xl border border-border bg-surface p-8 text-center"
      >
        <span className="mx-auto mb-4 inline-flex size-12 items-center justify-center rounded-full bg-danger-soft text-danger">
          <AlertTriangle aria-hidden="true" className="size-6" />
        </span>
        <h1 className="text-lg font-semibold text-foreground">
          Algo salió mal en esta vista
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        <div className="mt-5 flex justify-center gap-2">
          <Button onClick={() => window.location.reload()}>
            Recargar la página
          </Button>
          <Button variant="outline" render={<a href="/dashboard" />}>
            Ir al resumen
          </Button>
        </div>
      </div>
    </div>
  )
}
