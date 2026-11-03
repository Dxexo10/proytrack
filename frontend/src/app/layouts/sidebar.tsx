import { Link, useLocation } from 'react-router-dom'
import { LogoMark } from '@/components/shared/logo-mark'
import { DemoBadge } from '@/components/shared/demo-badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DEMO_CURRENT_USER } from '@/data/mock/seed/users'
import { ROLE_LABELS } from '@/lib/labels'
import { initials } from '@/domain/utils/format'
import { isRouteActive } from '@/lib/navigation'
import { cn } from '@/lib/utils'
import { PRIMARY_NAV, SECONDARY_NAV, type NavItem } from './nav-items'

interface SidebarLinkProps {
  item: NavItem
  active: boolean
}

function SidebarLink({ item, active }: SidebarLinkProps) {
  const Icon = item.icon

  return (
    <Link
      to={item.href}
      title={item.phase ? `${item.label} · ${item.phase}` : item.label}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
        'justify-center xl:justify-start',
        active
          ? 'bg-white/10 text-white'
          : 'text-sidebar-foreground/80 hover:bg-white/5 hover:text-white',
      )}
    >
      {active ? (
        <span
          aria-hidden="true"
          className="absolute top-1/2 left-0 h-5 w-0.5 -translate-y-1/2 rounded-r-full bg-brand-primary"
        />
      ) : null}
      <Icon aria-hidden="true" className="size-[18px] shrink-0" />
      <span className="hidden truncate xl:inline">{item.label}</span>
      {item.phase ? (
        <span
          className="ml-auto hidden rounded bg-white/10 px-1.5 py-0.5 text-[10px] font-medium text-sidebar-foreground/70 xl:inline"
          aria-hidden="true"
        >
          {item.phase.replace('Fase ', 'F')}
        </span>
      ) : null}
    </Link>
  )
}

interface SidebarNavProps {
  onNavigate?: () => void
}

export function SidebarNav({ onNavigate }: SidebarNavProps) {
  const { pathname } = useLocation()

  return (
    <>
      <nav
        aria-label="Navegación principal"
        className="flex-1 space-y-1 overflow-y-auto p-2 xl:p-3"
      >
        <p className="hidden px-2 pt-1 pb-2 text-[10px] font-semibold tracking-wider text-sidebar-foreground/50 uppercase xl:block">
          Portafolio
        </p>
        {PRIMARY_NAV.map((item) => (
          <div key={item.href} onClick={onNavigate}>
            <SidebarLink
              item={item}
              active={isRouteActive(pathname, item.href)}
            />
          </div>
        ))}
      </nav>

      <div className="space-y-3 border-t border-sidebar-border p-2 xl:p-3">
        {SECONDARY_NAV.map((item) => (
          <div key={item.href} onClick={onNavigate}>
            <SidebarLink
              item={item}
              active={isRouteActive(pathname, item.href)}
            />
          </div>
        ))}

        <DemoBadge variant="dark" className="hidden w-full justify-center xl:flex" />

        <div className="flex items-center gap-3 rounded-lg bg-white/5 px-2 py-2 xl:px-3">
          <Avatar size="sm" className="shrink-0">
            <AvatarFallback className="bg-brand-primary/20 text-xs font-semibold text-blue-200">
              {initials(DEMO_CURRENT_USER.name)}
            </AvatarFallback>
          </Avatar>
          <div className="hidden min-w-0 xl:block">
            <p className="truncate text-xs font-medium text-white">
              {DEMO_CURRENT_USER.name}
            </p>
            <p className="truncate text-[11px] text-sidebar-foreground/60">
              {ROLE_LABELS[DEMO_CURRENT_USER.role]}
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-40 hidden w-[72px] flex-col border-r border-sidebar-border bg-sidebar lg:flex xl:w-64">
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-sidebar-border px-4 xl:px-5">
        <Link
          to="/dashboard"
          className="flex items-center gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
          aria-label="ProyTrack — ir al resumen general"
        >
          <LogoMark />
          <span className="hidden min-w-0 xl:block">
            <span className="block truncate text-sm font-semibold text-white">
              ProyTrack
            </span>
            <span className="block truncate text-[11px] text-sidebar-foreground/60">
              Project Management &amp; Intelligence
            </span>
          </span>
        </Link>
      </div>
      <SidebarNav />
    </aside>
  )
}
