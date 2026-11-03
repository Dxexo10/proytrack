import { RotateCcw, TriangleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface ErrorStateProps {
  title?: string
  message: string
  onRetry?: () => void
  className?: string
}

export function ErrorState({
  title = 'No pudimos cargar la información',
  message,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      role="alert"
      className={cn(
        'flex flex-col items-center justify-center gap-2 rounded-2xl border border-danger/20 bg-danger-soft px-6 py-10 text-center',
        className,
      )}
    >
      <span className="inline-flex size-10 items-center justify-center rounded-full bg-danger/10 text-danger">
        <TriangleAlert aria-hidden="true" className="size-5" />
      </span>
      <p className="text-sm font-semibold text-danger">{title}</p>
      <p className="max-w-md text-sm text-danger/90">{message}</p>
      {onRetry ? (
        <Button variant="outline" size="sm" className="mt-2" onClick={onRetry}>
          <RotateCcw aria-hidden="true" className="size-4" />
          Reintentar
        </Button>
      ) : null}
    </div>
  )
}
