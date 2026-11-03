import { History } from 'lucide-react'
import { ComingSoon } from '@/components/shared/coming-soon'

export function ActivityPage() {
  return (
    <ComingSoon
      title="Actividad"
      description="Registro de auditoría de todo lo que ocurre en el portafolio demo."
      phase="Fase 4"
      icon={History}
      plannedFeatures={[
        'Timeline cronológica con autor, fecha y tipo de acción',
        'Filtros por proyecto, usuario demo y periodo',
        'Paginación del histórico completo',
        'Origen del evento: simulado, manual o del sistema',
      ]}
    />
  )
}
