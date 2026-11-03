import { Link, useLocation } from 'react-router-dom'
import { BellRing, CalendarDays, Search } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DEMO_REFERENCE_DATE } from '@/lib/demo-config'
import { formatDate } from '@/domain/utils/date'
import { initials } from '@/domain/utils/format'
import { ROLE_LABELS } from '@/lib/labels'
import { DEMO_CURRENT_USER } from '@/data/mock/seed/users'
import { ROUTE_TITLES } from './nav-items'
import { MobileNav } from './mobile-nav'
import { useOpenAlertsCount } from '@/features/alerts/hooks/use-open-alerts'

function Breadcrumb() {
  const { pathname } = useLocation()
  const title = ROUTE_TITLES[pathname] ?? 'Página no encontrada'
  const parent = pathname.startsWith('/projects')
    ? { label: 'Proyectos', href: '/projects' }
    : null

  return (
    <nav aria-label="Ruta de navegación" className="min-w-0">
      <ol className="flex min-w-0 items-center gap-1.5 text-sm">
        <li className="hidden text-muted-foreground sm:block">ProyTrack</li>
        <li aria-hidden="true" className="hidden text-muted-foreground/50 sm:block">
          /
        </li>
        {parent && parent.href !== pathname ? (
          <>
            <li className="hidden sm:block">
              <Link
                to={parent.href}
                className="rounded text-muted-foreground hover:text-foreground"
              >
                {parent.label}
              </Link>
            </li>
            <li
              aria-hidden="true"
              className="hidden text-muted-foreground/50 sm:block"
            >
              /
            </li>
          </>
        ) : null}
        <li className="truncate font-medium text-foreground">{title}</li>
      </ol>
    </nav>
  )
}

function AlertsShortcut() {
  const { data: openAlerts } = useOpenAlertsCount()
  const count = openAlerts ?? 0

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative"
      render={<Link to="/alerts" />}
      aria-label={`Centro de alertas: ${count} alertas abiertas`}
    >
      <BellRing aria-hidden="true" className="size-[18px]" />
      {count > 0 ? (
        <span className="absolute -top-0.5 -right-0.5 inline-flex min-w-4 items-center justify-center rounded-full bg-danger px-1 text-[10px] font-semibold leading-4 text-white">
          {count > 9 ? '9+' : count}
        </span>
      ) : null}
    </Button>
  )
}

function UserMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full"
            aria-label="Abrir menú de perfil"
          />
        }
      >
        <Avatar size="sm">
          <AvatarFallback className="bg-brand-navy text-[11px] font-semibold text-white">
            {initials(DEMO_CURRENT_USER.name)}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-64">
        <DropdownMenuLabel>Perfil de demostración</DropdownMenuLabel>
        <div className="px-1.5 pb-2">
          <p className="text-sm font-medium text-foreground">
            {DEMO_CURRENT_USER.name}
          </p>
          <p className="text-xs text-muted-foreground">
            {DEMO_CURRENT_USER.email}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {ROLE_LABELS[DEMO_CURRENT_USER.role]}
          </p>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          render={<Link to="/settings" />}
          className="cursor-pointer"
        >
          Configuración demo
        </DropdownMenuItem>
        <DropdownMenuItem disabled>
          Restablecer datos · Fase 4
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export function Topbar() {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-2 border-b border-border bg-surface/85 px-3 backdrop-blur supports-[backdrop-filter]:bg-surface/70 sm:px-5 lg:px-6">
      <MobileNav />
      <Breadcrumb />

      <div className="ml-auto flex items-center gap-1 sm:gap-1.5">
        <span className="mr-1 hidden items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-1 text-xs text-muted-foreground md:inline-flex">
          <CalendarDays aria-hidden="true" className="size-3.5" />
          Datos al {formatDate(DEMO_REFERENCE_DATE)}
        </span>

        <Button
          variant="ghost"
          size="icon"
          disabled
          aria-label="Buscador global — disponible en la Fase 2"
          title="Buscador global · disponible en la Fase 2"
        >
          <Search aria-hidden="true" className="size-[18px]" />
        </Button>

        <AlertsShortcut />
        <UserMenu />
      </div>
    </header>
  )
}
