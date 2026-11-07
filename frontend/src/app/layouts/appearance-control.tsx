import type { LucideIcon } from 'lucide-react'
import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from '@/app/theme-context'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import type { ThemePreference } from '@/lib/theme'
import { cn } from '@/lib/utils'

interface ThemeOption {
  value: ThemePreference
  label: string
  icon: LucideIcon
}

const THEME_OPTIONS: ThemeOption[] = [
  { value: 'light', label: 'Claro', icon: Sun },
  { value: 'dark', label: 'Oscuro', icon: Moon },
  { value: 'system', label: 'Sistema', icon: Monitor },
]

const FOCUS_RING =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-ivory/80'

interface AppearanceControlProps {
  collapsed?: boolean
}

export function AppearanceControl({
  collapsed = false,
}: AppearanceControlProps) {
  const { theme, setTheme } = useTheme()
  const current = THEME_OPTIONS.find((option) => option.value === theme)
  const CurrentIcon = current?.icon ?? Monitor
  const currentLabel = current?.label ?? 'Sistema'

  if (!collapsed) {
    return (
      <div className="px-0 pt-1 pb-1">
        <p className="px-2 pb-1.5 text-[10px] font-semibold tracking-[0.16em] text-sidebar-foreground/45 uppercase">
          Apariencia
        </p>
        <div
          role="group"
          aria-label="Apariencia"
          className="grid grid-cols-3 gap-1 rounded-xl bg-white/[0.04] p-1"
        >
          {THEME_OPTIONS.map(({ value, label, icon: Icon }) => {
            const selected = theme === value

            return (
              <button
                key={value}
                type="button"
                onClick={() => setTheme(value)}
                aria-pressed={selected}
                className={cn(
                  'flex flex-col items-center gap-1 rounded-lg px-1 py-1.5 text-[10px] font-medium transition-colors duration-200',
                  FOCUS_RING,
                  selected
                    ? 'bg-white/[0.1] text-brand-ivory'
                    : 'text-sidebar-foreground/60 hover:bg-white/[0.06] hover:text-brand-ivory',
                )}
              >
                <Icon aria-hidden="true" className="size-3.5" />
                {label}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <DropdownMenu>
      <Tooltip>
        <TooltipTrigger
          render={
            <DropdownMenuTrigger
              render={
                <button
                  type="button"
                  aria-label={`Apariencia: ${currentLabel}`}
                  title={`Apariencia: ${currentLabel}`}
                  className={cn(
                    'mx-auto flex size-10 items-center justify-center rounded-xl text-sidebar-foreground/85 transition-colors duration-200 hover:bg-white/[0.05] hover:text-brand-ivory',
                    FOCUS_RING,
                  )}
                >
                  <CurrentIcon aria-hidden="true" className="size-4" />
                </button>
              }
            />
          }
        />
        <TooltipContent side="right" sideOffset={12}>
          Apariencia: {currentLabel}
        </TooltipContent>
      </Tooltip>

      <DropdownMenuContent
        side="right"
        align="start"
        sideOffset={12}
        className="w-44 border border-white/10 bg-brand-graphite text-sidebar-foreground"
      >
        <DropdownMenuGroup>
          <DropdownMenuLabel className="text-sidebar-foreground/50">
            Apariencia
          </DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={theme}
            onValueChange={(value) => setTheme(value as ThemePreference)}
          >
            {THEME_OPTIONS.map(({ value, label, icon: Icon }) => (
              <DropdownMenuRadioItem
                key={value}
                value={value}
                className="text-sidebar-foreground/80 focus:bg-white/[0.08] focus:text-brand-ivory"
              >
                <Icon aria-hidden="true" className="size-4" />
                {label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
