import { PlusCircle } from 'lucide-react'
import { ComingSoon } from '@/components/shared/coming-soon'

export function ProjectNewPage() {
  return (
    <ComingSoon
      title="Nuevo proyecto"
      description="Formulario de alta con validación y separación entre línea base y presupuesto actual."
      phase="Fase 2"
      icon={PlusCircle}
      plannedFeatures={[
        'Secciones de información general, presupuesto, cronograma y asignación',
        'Validación con Zod y errores en línea por campo',
        'Prevención de presupuestos negativos y avance fuera de 0–100',
        'Aviso de cambios sin guardar antes de salir',
      ]}
    />
  )
}
