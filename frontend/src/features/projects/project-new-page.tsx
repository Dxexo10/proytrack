import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { DemoBadge } from '@/components/shared/demo-badge'
import { PageHeader } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { DEMO_USERS } from '@/data/mock/seed/users'
import { addDays, parseDate, toISODate } from '@/domain/utils/date'
import { DEMO_REFERENCE_DATE } from '@/lib/demo-config'
import { useCreateProject } from './hooks/use-project-mutations'
import { ProjectForm } from './project-form'
import {
  toProjectInput,
  type ProjectFormValues,
} from './project-form-schema'

const DEFAULT_DATES: ProjectFormValues = {
  name: '',
  client: '',
  description: '',
  sector: 'technology',
  ownerId: DEMO_USERS[0]?.id ?? '',
  status: 'planned',
  priority: 'medium',
  initialBudget: '0',
  currentBudget: '0',
  progress: '0',
  startDate: DEMO_REFERENCE_DATE,
  dueDate: toISODate(addDays(parseDate(DEMO_REFERENCE_DATE), 30)),
  completedAt: '',
  tags: '',
}

export function ProjectNewPage() {
  const navigate = useNavigate()
  const create = useCreateProject()

  return (
    <div className="space-y-5 lg:space-y-6">
      <PageHeader
        title="Nuevo proyecto"
        description="Registra el proyecto con su línea base, cronograma y responsable."
        meta={<DemoBadge />}
        actions={
          <Button variant="outline" size="sm" render={<Link to="/projects" />}>
            <ArrowLeft aria-hidden="true" className="size-4" />
            Volver al listado
          </Button>
        }
      />

      <ProjectForm
        defaultValues={DEFAULT_DATES}
        users={DEMO_USERS}
        isSubmitting={create.isPending}
        submitLabel="Crear proyecto"
        cancelHref="/projects"
        onSubmit={(values) => {
          create.mutate(toProjectInput(values), {
            onSuccess: (project) => navigate(`/projects/${project.id}`),
          })
        }}
      />
    </div>
  )
}
