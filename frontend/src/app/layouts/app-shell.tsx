import { Outlet } from 'react-router-dom'
import { DEMO_LABEL } from '@/lib/demo-config'
import { Sidebar } from './sidebar'
import { Topbar } from './topbar'

export function AppShell() {
  return (
    <div className="min-h-svh bg-canvas">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-md focus:bg-brand-navy focus:px-3 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Saltar al contenido
      </a>

      <Sidebar />

      <div className="flex min-h-svh flex-col lg:pl-[72px] xl:pl-64">
        <Topbar />
        <main
          id="contenido"
          tabIndex={-1}
          className="mx-auto w-full max-w-[1600px] flex-1 px-4 py-6 outline-none sm:px-6 lg:px-8 lg:py-8"
        >
          <Outlet />
        </main>
        <footer className="border-t border-border px-4 py-4 text-xs text-muted-foreground sm:px-6 lg:px-8">
          <div className="mx-auto flex w-full max-w-[1600px] flex-wrap items-center justify-between gap-2">
            <span>
              ProyTrack · Project Management &amp; Intelligence
            </span>
            <span>{DEMO_LABEL}</span>
          </div>
        </footer>
      </div>
    </div>
  )
}
