import { FolderSearch } from 'lucide-react'
import { ComingSoon } from '@/components/shared/coming-soon'

export function ProjectDetailPage() {
  return (
    <ComingSoon
      title="Detalle del proyecto"
      description="Resumen ejecutivo, historial de versiones y comparador de cambios."
      phase="Fase 3"
      icon={FolderSearch}
      plannedFeatures={[
        'Cabecera con estado, responsable y presupuesto vigente',
        'KPIs de variación presupuestal, avance y alertas abiertas',
        'Pestañas Resumen, Historial y Comparar versiones',
        'Comparador antes/después con la regla que disparó cada alerta',
      ]}
    />
  )
}
