import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DEMO_CURRENT_USER } from '@/data/mock/seed/users'
import { initials } from '@/domain/utils/format'
import { ROLE_LABELS } from '@/lib/labels'
import { cn } from '@/lib/utils'

interface SidebarProfileProps {
  collapsed: boolean
  variant?: 'desktop' | 'mobile'
  onToggle?: () => void
}

function ProfileAvatar() {
  return (
    <Avatar size="lg" className="shrink-0">
      <AvatarFallback className="bg-brand-terracotta/20 text-sm font-semibold text-brand-ivory">
        {initials(DEMO_CURRENT_USER.name)}
      </AvatarFallback>
    </Avatar>
  )
}

export function SidebarProfile({
  collapsed,
  variant = 'desktop',
  onToggle,
}: SidebarProfileProps) {
  const isCompact = collapsed && variant === 'desktop'

  const toggle = onToggle ? (
    <Button
      variant="ghost"
      size="icon-sm"
      onClick={onToggle}
      aria-label={collapsed ? 'Expandir navegación' : 'Contraer navegación'}
      title={collapsed ? 'Expandir navegación' : 'Contraer navegación'}
      className="shrink-0 text-sidebar-foreground/60 hover:bg-white/10 hover:text-brand-ivory focus-visible:outline-brand-ivory/80"
    >
      {collapsed ? (
        <PanelLeftOpen aria-hidden="true" className="size-4" />
      ) : (
        <PanelLeftClose aria-hidden="true" className="size-4" />
      )}
    </Button>
  ) : null

  const avatarTrigger = (
    <button
      type="button"
      onClick={onToggle}
      className="rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ivory/80"
      aria-label={`Expandir navegación · ${DEMO_CURRENT_USER.name}`}
    >
      <ProfileAvatar />
    </button>
  )

  if (isCompact) {
    return (
      <div className="flex shrink-0 flex-col items-center gap-2 px-2 pt-3 pb-2">
        <Tooltip>
          <TooltipTrigger render={avatarTrigger} />
          <TooltipContent side="right" sideOffset={12}>
            {DEMO_CURRENT_USER.name}
          </TooltipContent>
        </Tooltip>
        {toggle}
      </div>
    )
  }

  return (
    <div
      className={cn(
        'flex shrink-0 items-start justify-between gap-2 pt-3 pb-2',
        variant === 'mobile' ? 'px-3 pr-10' : 'px-3',
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <ProfileAvatar />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-brand-ivory">
            {DEMO_CURRENT_USER.name}
          </p>
          <p className="truncate text-[11px] text-sidebar-foreground/60">
            {ROLE_LABELS[DEMO_CURRENT_USER.role]}
          </p>
        </div>
      </div>
      {toggle}
    </div>
  )
}
