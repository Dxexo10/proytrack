import { Radar } from 'lucide-react'
import { ComingSoon } from '@/components/shared/coming-soon'

export function MonitorPage() {
  return (
    <ComingSoon
      title="Monitor de cambios"
      description="La función distintiva de Trazo: cada modificación relevante, explicada."
      phase="Fase 3"
      icon={Radar}
      plannedFeatures={[
        'Feed de cambios agrupado por fecha y proyecto',
        'Filtros por campo, severidad, periodo y origen del cambio',
        'Detalle del cambio con valores anteriores y nuevos',
        'Generación de versiones inmutables y eventos de cambio',
      ]}
    />
  )
}
