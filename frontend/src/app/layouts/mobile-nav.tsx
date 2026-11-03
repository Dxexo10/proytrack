import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LogoMark } from '@/components/shared/logo-mark'
import { DemoBadge } from '@/components/shared/demo-badge'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useOpenAlertsCount } from '@/features/alerts/hooks/use-open-alerts'
import { SidebarNav } from './sidebar'

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const { data: openAlerts } = useOpenAlertsCount()

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label="Abrir navegación"
          />
        }
      >
        <Menu aria-hidden="true" className="size-5" />
      </SheetTrigger>
      <SheetContent
        side="left"
        showCloseButton={false}
        className="w-[280px] gap-0 border-white/10 bg-brand-graphite p-0 text-sidebar-foreground sm:max-w-[280px]"
      >
        <SheetHeader className="flex h-16 flex-row items-center gap-3 border-b border-white/10 px-4 py-0">
          <LogoMark />
          <div className="min-w-0">
            <SheetTitle className="font-heading text-base font-semibold text-brand-ivory">
              trazo<span className="text-brand-terracotta">.</span>
            </SheetTitle>
            <SheetDescription className="text-[10px] tracking-[0.16em] text-sidebar-foreground/50 uppercase">
              Gestión inteligente
            </SheetDescription>
          </div>
          <SheetClose
            render={
              <Button
                variant="ghost"
                size="icon-sm"
                className="ml-auto text-sidebar-foreground/60 hover:bg-white/10 hover:text-brand-ivory"
                aria-label="Cerrar navegación"
              />
            }
          >
            <X aria-hidden="true" className="size-4" />
          </SheetClose>
        </SheetHeader>

        <SidebarNav onNavigate={() => setOpen(false)} />

        <div className="border-t border-white/10 p-3">
          <DemoBadge variant="dark" className="w-full justify-center" />
          <p className="mt-2 text-center text-[11px] text-sidebar-foreground/60">
            {openAlerts ?? 0} alertas abiertas ·{' '}
            <Link
              to="/alerts"
              className="underline underline-offset-2 hover:text-white"
              onClick={() => setOpen(false)}
            >
              ver centro
            </Link>
          </p>
        </div>
      </SheetContent>
    </Sheet>
  )
}
