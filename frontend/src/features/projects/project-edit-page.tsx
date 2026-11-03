import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, FolderSearch } from 'lucide-react'
import { DemoBadge } from '@/components/shared/demo-badge'
import { EmptyState } from '@/components/shared/empty-state'
import { ErrorState } from '@/components/shared/error-state'
import { PageHeader } from '@/components/shared/page-header'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { DEMO_USERS } from '@/data/mock/seed/users'
import { useUpdateProject } from './hooks/use-project-mutations'
import { useProjectQuery } from './hooks/use-project-query'
import { ProjectForm } from './project-form'
import {
  toFormValues,
  toProjectInput,
  type ProjectFormValues,
} from './project-form-schema'

export function ProjectEditPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const projectQuery = useProjectQuery(id)
  const update = useUpdateProject(id ?? '')

  if (projectQuery.isPending) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-4 w-80" />
        <Card className="gap-3 p-5">
          {Array.from({ length: 6 }, (_, index) => (
            <Skeleton key={index} className="h-10 w-full rounded-xl" />
          ))}
        </Card>
      </div>
    )
  }

  if (projectQuery.isError) {
    return (
      <ErrorState
        message={
          projectQuery.error instanceof Error
            ? projectQuery.error.message
            : 'No pudimos cargar el proyecto.'
        }
        onRetry={() => void projectQuery.refetch()}
      />
    )
  }

  const project = projectQuery.data

  if (!project) {
    return (
      <EmptyState
        icon={FolderSearch}
        title="Proyecto no encontrado"
        description="Puede que ya no exista o que el enlace sea incorrecto."
        action={
          <Button variant="outline" size="sm" render={<Link to="/projects" />}>
            <ArrowLeft aria-hidden="true" className="size-4" />
            Volver al listado
          </Button>
        }
      />
    )
  }

  const values: ProjectFormValues = toFormValues(project)

  return (
    <div className="space-y-5 lg:space-y-6">
      <PageHeader
        title="Editar proyecto"
        description={`${project.code} · ${project.name}`}
        meta={<DemoBadge />}
        actions={
          <Button
            variant="outline"
            size="sm"
            render={<Link to={`/projects/${project.id}`} />}
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Volver al detalle
          </Button>
        }
      />

      <ProjectForm
        key={project.id}
        defaultValues={values}
        users={DEMO_USERS}
        isSubmitting={update.isPending}
        submitLabel="Guardar cambios"
        cancelHref={`/projects/${project.id}`}
        onSubmit={(nextValues) => {
          update.mutate(toProjectInput(nextValues), {
            onSuccess: () => navigate(`/projects/${project.id}`),
          })
        }}
      />
    </div>
  )
}
