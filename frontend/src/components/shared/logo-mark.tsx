import { cn } from '@/lib/utils'

interface LogoMarkProps {
  className?: string
}

export function LogoMark({ className }: LogoMarkProps) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/15',
        className,
      )}
    >
      <span className="flex items-end gap-[3px]">
        <span className="h-2 w-1 rounded-sm bg-blue-300" />
        <span className="h-3.5 w-1 rounded-sm bg-blue-400" />
        <span className="h-5 w-1 rounded-sm bg-brand-primary" />
      </span>
    </span>
  )
}
