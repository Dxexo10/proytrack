import { Settings } from 'lucide-react'
import { ComingSoon } from '@/components/shared/coming-soon'

export function SettingsPage() {
  return (
    <ComingSoon
      title="Configuración demo"
      description="Preferencias del entorno y control total sobre los datos simulados."
      phase="Fase 4"
      icon={Settings}
      plannedFeatures={[
        'Perfil demo con identificación clara de que no hay seguridad real',
        'Densidad de tablas y preferencias de visualización',
        'Umbrales de reglas configurables para la demo',
        'Restaurar datos con confirmación y versión del dataset',
      ]}
    />
  )
}
