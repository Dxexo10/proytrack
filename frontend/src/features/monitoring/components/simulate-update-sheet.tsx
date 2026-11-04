import { useState } from 'react'
import { Play } from 'lucide-react'
import { FilterSelect } from '@/components/shared/filter-select'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import type { Project } from '@/domain/models'
import { useSimulateUpdate } from '../hooks/use-simulate-update'
import {
  SCENARIOS,
  SIMULATION_SCENARIOS,
  scenarioOptions,
  type SimulationScenario,
} from '../scenarios'

interface SimulateUpdateSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  projects: readonly Project[]
}

export function SimulateUpdateSheet({
  open,
  onOpenChange,
  projects,
}: SimulateUpdateSheetProps) {
  const [projectId, setProjectId] = useState('')
  const [scenario, setScenario] =
    useState<SimulationScenario>('budget-increase')
  const simulate = useSimulateUpdate()

  const selectedProject = projects.find((project) => project.id === projectId)
  const definition = SCENARIOS[scenario]

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full gap-0 p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border px-5 pt-5 pb-4">
          <SheetDescription className="text-[11px] font-semibold tracking-[0.08em] uppercase">
            Solo entorno demo
          </SheetDescription>
          <SheetTitle className="text-lg">Simular actualización</SheetTitle>
          <p className="text-xs text-muted-foreground">
            Aplica un cambio controlado y genera versión, eventos y alertas
            reales sobre el dataset local.
          </p>
        </SheetHeader>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-5">
          <FilterSelect
            label="Proyecto"
            value={projectId}
            options={[
              { value: '', label: 'Selecciona un proyecto' },
              ...projects.map((project) => ({
                value: project.id,
                label: `${project.code} · ${project.name}`,
              })),
            ]}
            onChange={setProjectId}
          />

          <FilterSelect
            label="Escenario"
            value={scenario}
            options={scenarioOptions()}
            onChange={(next) => setScenario(next as SimulationScenario)}
          />

          <div className="rounded-xl border border-border bg-sand-soft/60 p-4">
            <p className="text-xs font-medium text-foreground">
              {definition.label}
            </p>
            <p className="pt-1 text-xs text-muted-foreground">
              {definition.description}
            </p>
            {selectedProject ? (
              <p className="pt-2 text-[11px] text-muted-foreground">
                Se aplicará sobre {selectedProject.code} ·{' '}
                {selectedProject.name}.
              </p>
            ) : null}
          </div>

          <p className="text-[11px] text-muted-foreground">
            Escenarios disponibles: {SIMULATION_SCENARIOS.length}. El origen del
            evento quedará marcado como simulado.
          </p>
        </div>

        <div className="border-t border-border px-5 py-4">
          <Button
            className="w-full"
            disabled={!projectId || simulate.isPending}
            onClick={() => {
              if (!selectedProject) return
              simulate.mutate(
                { project: selectedProject, scenario },
                { onSuccess: () => onOpenChange(false) },
              )
            }}
          >
            <Play aria-hidden="true" className="size-4" />
            {simulate.isPending ? 'Ejecutando…' : 'Ejecutar simulación'}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  )
}
