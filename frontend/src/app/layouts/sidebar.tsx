import { Link, useLocation } from 'react-router-dom'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { LogoMark } from '@/components/shared/logo-mark'
import { DemoBadge } from '@/components/shared/demo-badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DEMO_CURRENT_USER } from '@/data/mock/seed/users'
import { ROLE_LABELS } from '@/lib/labels'
import { initials } from '@/domain/utils/format'
import { isRouteActive } from '@/lib/navigation'
import { cn } from '@/lib/utils'
import { PRIMARY_NAV, SECONDARY_NAV, type NavItem } from './nav-items'

interface SidebarLinkProps {
  item: NavItem
  active: boolean
  collapsed?: boolean
  onNavigate?: () => void
}

function SidebarLink({
  item,
  active,
  collapsed = false,
  onNavigate,
}: SidebarLinkProps) {
  const Icon = item.icon

  const link = (
    <Link
      to={item.href}
      onClick={onNavigate}
      aria-current={active ? 'page' : undefined}
      aria-label={collapsed ? item.label : undefined}
      className={cn(
        'group relative flex items-center rounded-xl text-sm font-medium transition-colors duration-150',
        collapsed ? 'mx-auto size-10 justify-center' : 'gap-3 px-2.5 py-2',
        active
          ? 'bg-white/[0.08] text-white'
          : 'text-sidebar-foreground/80 hover:bg-white/[0.05] hover:text-white',
      )}
    >
      {active ? (
        <span
          aria-hidden="true"
          className="absolute top-1/2 -left-1 h-5 w-[3px] -translate-y-1/2 rounded-full bg-brand-primary"
        />
      ) : null}
      <span
        className={cn(
          'inline-flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-150',
          active
            ? 'bg-brand-primary text-white shadow-[0_6px_16px_-8px_rgba(37,99,235,0.9)]'
            : 'text-slate-400 group-hover:text-white',
        )}
      >
        <Icon aria-hidden="true" className="size-[18px]" />
      </span>
      {!collapsed ? (
        <>
          <span className="truncate">{item.label}</span>
          {item.phase ? (
            <span
              className="ml-auto rounded-md bg-white/[0.06] px-1.5 py-0.5 text-[10px] font-medium text-sidebar-foreground/60"
              aria-hidden="true"
            >
              {item.phase.replace('Fase ', 'F')}
            </span>
          ) : null}
        </>
      ) : null}
    </Link>
  )

  if (!collapsed) return link

  return (
    <Tooltip>
      <TooltipTrigger render={link} />
      <TooltipContent side="right" sideOffset={12}>
        {item.label}
        {item.phase ? ` · ${item.phase}` : ''}
      </TooltipContent>
    </Tooltip>
  )
}

interface SidebarNavProps {
  collapsed?: boolean
  onNavigate?: () => void
  showDemoBadge?: boolean
}

export function SidebarNav({
  collapsed = false,
  onNavigate,
  showDemoBadge = true,
}: SidebarNavProps) {
  const { pathname } = useLocation()

  return (
    <>
      <nav
        aria-label="Navegación principal"
        className={cn(
          'flex-1 space-y-1 overflow-x-hidden overflow-y-auto py-2',
          collapsed ? 'px-2' : 'px-3',
        )}
      >
        {!collapsed ? (
          <p className="px-2 pt-1 pb-1.5 text-[10px] font-semibold tracking-[0.14em] text-slate-500 uppercase">
            Portafolio
          </p>
        ) : null}
        {PRIMARY_NAV.map((item) => (
          <SidebarLink
            key={item.href}
            item={item}
            active={isRouteActive(pathname, item.href)}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}
      </nav>

      <div
        className={cn(
          'mt-auto border-t border-white/10',
          collapsed ? 'space-y-1 px-2 py-2' : 'space-y-2 px-3 py-3',
        )}
      >
        {SECONDARY_NAV.map((item) => (
          <SidebarLink
            key={item.href}
            item={item}
            active={isRouteActive(pathname, item.href)}
            collapsed={collapsed}
            onNavigate={onNavigate}
          />
        ))}

        {!collapsed && showDemoBadge ? (
          <DemoBadge variant="dark" className="w-full justify-center" />
        ) : null}

        <div
          title={
            collapsed
              ? `${DEMO_CURRENT_USER.name} · ${ROLE_LABELS[DEMO_CURRENT_USER.role]}`
              : undefined
          }
          className={cn(
            'flex items-center gap-2.5 rounded-xl bg-white/[0.06]',
            collapsed ? 'justify-center p-1.5' : 'p-2',
          )}
        >
          <Avatar size="sm" className="shrink-0">
            <AvatarFallback className="bg-brand-primary/20 text-xs font-semibold text-blue-200">
              {initials(DEMO_CURRENT_USER.name)}
            </AvatarFallback>
          </Avatar>
          {!collapsed ? (
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-white">
                {DEMO_CURRENT_USER.name}
              </p>
              <p className="truncate text-[11px] text-sidebar-foreground/60">
                {ROLE_LABELS[DEMO_CURRENT_USER.role]}
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </>
  )
}

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  return (
    <aside
      className={cn(
        'fixed top-3 bottom-3 left-3 z-40 hidden flex-col overflow-hidden rounded-2xl border border-white/10 bg-brand-navy bg-[image:radial-gradient(120%_80%_at_0%_0%,rgba(37,99,235,0.16),transparent_55%)] text-sidebar-foreground shadow-[0_24px_60px_-32px_rgba(15,23,42,0.8)] transition-[width] duration-200 ease-out lg:flex',
        collapsed ? 'w-[68px]' : 'w-60',
      )}
    >
      <div
        className={cn(
          'flex shrink-0 items-center gap-2 pb-1',
          collapsed ? 'flex-col justify-center px-2 pt-3' : 'px-3 pt-3',
        )}
      >
        <Link
          to="/dashboard"
          className="flex min-w-0 items-center gap-2.5 rounded-xl p-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-400"
          aria-label="ProyTrack — ir al resumen general"
        >
          <LogoMark />
          {!collapsed ? (
            <span className="hidden min-w-0 sm:block">
              <span className="block truncate text-sm font-semibold text-white">
                ProyTrack
              </span>
              <span className="block truncate text-[11px] text-sidebar-foreground/60">
                Project Management &amp; Intelligence
              </span>
            </span>
          ) : null}
        </Link>

        <Button
          variant="ghost"
          size="icon-sm"
          onClick={onToggle}
          aria-label={
            collapsed ? 'Expandir navegación' : 'Contraer navegación'
          }
          title={collapsed ? 'Expandir navegación' : 'Contraer navegación'}
          className={cn(
            'text-slate-400 hover:bg-white/10 hover:text-white',
            !collapsed && 'ml-auto',
          )}
        >
          {collapsed ? (
            <PanelLeftOpen aria-hidden="true" className="size-4" />
          ) : (
            <PanelLeftClose aria-hidden="true" className="size-4" />
          )}
        </Button>
      </div>

      <SidebarNav collapsed={collapsed} />
    </aside>
  )
}
