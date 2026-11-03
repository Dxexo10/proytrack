import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function PageFallback() {
  return (
    <div className="space-y-6" aria-busy="true">
      <span className="sr-only">Cargando la pantalla…</span>
      <div className="space-y-2">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Card key={index} className="gap-3 p-5">
            <Skeleton className="h-3.5 w-28" />
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-3 w-32" />
          </Card>
        ))}
      </div>
      <Skeleton className="h-[320px] rounded-xl" />
    </div>
  )
}
