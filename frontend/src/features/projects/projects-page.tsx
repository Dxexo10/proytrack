import { FolderKanban } from 'lucide-react'
import { ComingSoon } from '@/components/shared/coming-soon'

export function ProjectsPage() {
  return (
    <ComingSoon
      title="Proyectos"
      description="El portafolio completo con búsqueda, filtros combinables y paginación."
      phase="Fase 2"
      icon={FolderKanban}
      plannedFeatures={[
        'Tabla con código, responsable, estado, prioridad, avance y presupuesto',
        'Búsqueda por nombre o código y filtros reflejados en la URL',
        'Ordenamiento y paginación del portafolio',
        'Acciones por proyecto: ver, editar y archivar',
      ]}
    />
  )
}
