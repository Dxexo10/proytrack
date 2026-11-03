import type { ReactNode } from 'react'
import { Card } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ChartCardProps {
  title: string
  description: string
  action?: ReactNode
  summary: string
  children: ReactNode
  className?: string
  bodyClassName?: string
}

export function ChartCard({
  title,
  description,
  action,
  summary,
  children,
  className,
  bodyClassName,
}: ChartCardProps) {
  return (
    <Card className={cn('gap-0 p-0', className)}>
      <div className="flex items-start justify-between gap-3 px-5 pt-5">
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </div>
      <div className={cn('mt-4 px-2 pb-4 sm:px-3', bodyClassName)}>
        {children}
      </div>
      <p className="sr-only">{summary}</p>
    </Card>
  )
}
