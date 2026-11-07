import { Link, useLocation } from 'react-router-dom'
import { Wrench } from 'lucide-react'
import { LogoMark } from '@/components/shared/logo-mark'
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
        'group relative flex items-center rounded-xl text-sm font-medium transition-colors duration-200',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ivory/80',
        collapsed ? 'mx-auto size-10 justify-center' : 'gap-3 px-2.5 py-2',
        active
          ? 'bg-white/[0.07] text-brand-ivory'
          : 'text-sidebar-foreground/85 hover:bg-white/[0.05] hover:text-brand-ivory',
      )}
    >
      {active ? (
        <span
          aria-hidden="true"
          className="absolute top-1/2 -left-1 h-6 w-[3px] -translate-y-1/2 rounded-full bg-brand-terracotta"
        />
      ) : null}
      <span
        className={cn(
          'inline-flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors duration-200',
          active
            ? 'bg-primary text-primary-foreground shadow-[0_8px_18px_-10px_rgba(198,93,58,0.9)]'
            : 'text-sidebar-foreground/60 group-hover:text-brand-ivory',
        )}
      >
        <Icon aria-hidden="true" className="size-[18px]" />
      </span>
      {!collapsed ? (
        <>
          <span className="truncate">{item.label}</span>
          {item.phase ? (
            <span
              className="ml-auto rounded-md bg-white/[0.06] px-1.5 py-0.5 text-[10px] font-medium text-sidebar-foreground/55"
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
}

export function SidebarNav({
  collapsed = false,
  onNavigate,
}: SidebarNavProps) {
  const { pathname } = useLocation()

  return (
    <>
      <nav
        aria-label="Navegación principal"
        className={cn(
          'min-h-0 space-y-1 overflow-x-hidden overflow-y-auto py-2',
          collapsed ? 'px-2' : 'px-3',
        )}
      >
        {!collapsed ? (
          <p className="px-2 pt-1 pb-1.5 text-[10px] font-semibold tracking-[0.18em] text-sidebar-foreground/45 uppercase">
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
          'border-t border-white/10',
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

        <div
          title={
            collapsed
              ? `${DEMO_CURRENT_USER.name} · ${ROLE_LABELS[DEMO_CURRENT_USER.role]}`
              : undefined
          }
          className={cn(
            'flex items-center gap-2.5 rounded-xl bg-white/[0.05]',
            collapsed ? 'justify-center p-1.5' : 'p-2',
          )}
        >
          <Avatar size="sm" className="shrink-0">
            <AvatarFallback className="bg-brand-terracotta/20 text-xs font-semibold text-brand-ivory">
              {initials(DEMO_CURRENT_USER.name)}
            </AvatarFallback>
          </Avatar>
          {!collapsed ? (
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-brand-ivory">
                {DEMO_CURRENT_USER.name}
              </p>
              <p className="truncate text-[11px] text-sidebar-foreground/55">
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
        'fixed top-3 left-3 z-40 hidden max-h-[calc(100svh-1.5rem)] flex-col overflow-hidden rounded-3xl border border-white/[0.07] bg-brand-graphite bg-[image:radial-gradient(120%_80%_at_0%_0%,rgba(198,93,58,0.14),transparent_55%)] text-sidebar-foreground shadow-[0_24px_60px_-30px_rgba(37,40,36,0.7)] transition-[width] duration-[220ms] ease-out md:flex',
        collapsed ? 'w-[72px]' : 'w-[236px]',
      )}
    >
      <div
        className={cn(
          'flex shrink-0 items-center gap-2 pb-1',
          collapsed ? 'flex-col justify-center px-2 pt-3.5' : 'px-3 pt-3.5',
        )}
      >
        <Link
          to="/dashboard"
          className="flex min-w-0 items-center gap-2.5 rounded-xl p-1 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ivory/80"
          aria-label="Trazo — ir al resumen general"
        >
          <LogoMark />
          {!collapsed ? (
            <span className="hidden min-w-0 sm:block">
              <span className="block font-heading text-lg leading-none font-semibold tracking-tight text-brand-ivory">
                trazo<span className="text-brand-terracotta">.</span>
              </span>
              <span className="mt-1 block truncate text-[10px] tracking-[0.16em] text-sidebar-foreground/50 uppercase">
                Gestión inteligente
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
            'text-sidebar-foreground/60 hover:bg-white/10 hover:text-brand-ivory focus-visible:outline-brand-ivory/80',
            !collapsed && 'ml-auto',
          )}
        >
          <Wrench aria-hidden="true" className="size-4" />
        </Button>
      </div>

      <SidebarNav collapsed={collapsed} />
    </aside>
  )
}
