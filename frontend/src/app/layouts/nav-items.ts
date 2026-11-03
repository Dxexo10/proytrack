import type { LucideIcon } from 'lucide-react'
import {
  BellRing,
  FolderKanban,
  History,
  LayoutDashboard,
  Radar,
  Settings,
} from 'lucide-react'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
  phase?: string
}

export const PRIMARY_NAV: NavItem[] = [
  { label: 'Resumen general', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Proyectos', href: '/projects', icon: FolderKanban },
  { label: 'Monitor de cambios', href: '/monitor', icon: Radar, phase: 'Fase 3' },
  { label: 'Centro de alertas', href: '/alerts', icon: BellRing, phase: 'Fase 3' },
  { label: 'Actividad', href: '/activity', icon: History, phase: 'Fase 4' },
]

export const SECONDARY_NAV: NavItem[] = [
  { label: 'Configuración demo', href: '/settings', icon: Settings, phase: 'Fase 4' },
]

export const ROUTE_TITLES: Record<string, string> = {
  '/dashboard': 'Resumen general',
  '/projects': 'Proyectos',
  '/projects/new': 'Nuevo proyecto',
  '/monitor': 'Monitor de cambios',
  '/alerts': 'Centro de alertas',
  '/activity': 'Actividad',
  '/settings': 'Configuración demo',
}
