import { BellRing } from 'lucide-react'
import { ComingSoon } from '@/components/shared/coming-soon'

export function AlertsPage() {
  return (
    <ComingSoon
      title="Centro de alertas"
      description="Alertas explicables generadas por reglas de negocio, nunca por cajas negras."
      phase="Fase 3"
      icon={BellRing}
      plannedFeatures={[
        'Contadores de alertas abiertas, críticas, revisadas y resueltas',
        'Regla que disparó cada alerta y variación que la originó',
        'Acciones para revisar y resolver con trazabilidad',
        'Filtros por severidad, proyecto y fecha',
      ]}
    />
  )
}
