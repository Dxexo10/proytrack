import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { initials } from '@/domain/utils/format'
import { cn } from '@/lib/utils'

interface UserChipProps {
  name: string
  className?: string
  size?: 'sm' | 'default'
}

export function UserChip({ name, className, size = 'sm' }: UserChipProps) {
  return (
    <span className={cn('inline-flex min-w-0 items-center gap-2', className)}>
      <Avatar size={size} className="shrink-0">
        <AvatarFallback className="bg-sand-soft text-[10px] font-semibold text-text-secondary">
          {initials(name)}
        </AvatarFallback>
      </Avatar>
      <span className="truncate text-sm text-foreground">{name}</span>
    </span>
  )
}
