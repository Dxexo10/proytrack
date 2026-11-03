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
        'flex flex-col items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50/60 px-6 py-10 text-center',
        className,
      )}
    >
      <span className="inline-flex size-10 items-center justify-center rounded-full bg-red-100 text-red-600">
        <TriangleAlert aria-hidden="true" className="size-5" />
      </span>
      <p className="text-sm font-semibold text-red-900">{title}</p>
      <p className="max-w-md text-sm text-red-800">{message}</p>
      {onRetry ? (
        <Button variant="outline" size="sm" className="mt-2" onClick={onRetry}>
          <RotateCcw aria-hidden="true" className="size-4" />
          Reintentar
        </Button>
      ) : null}
    </div>
  )
}
