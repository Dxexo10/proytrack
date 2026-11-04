import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  projectRepository,
  type CreateProjectInput,
  type UpdateProjectInput,
} from '@/data'
import { DEMO_CURRENT_USER } from '@/data/mock/seed/users'

function invalidateProjectData(queryClient: ReturnType<typeof useQueryClient>) {
  void queryClient.invalidateQueries({ queryKey: ['projects'] })
  void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
  void queryClient.invalidateQueries({ queryKey: ['alerts'] })
  void queryClient.invalidateQueries({ queryKey: ['monitor'] })
}

function messageFrom(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback
}

export function useCreateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateProjectInput) =>
      projectRepository.create(input, {
        actorId: DEMO_CURRENT_USER.id,
        source: 'manual',
      }),
    onSuccess: (project) => {
      invalidateProjectData(queryClient)
      toast.success('Proyecto creado correctamente.', {
        description: `${project.code} · ${project.name}`,
      })
    },
    onError: (error) => {
      toast.error(messageFrom(error, 'No pudimos crear el proyecto.'))
    },
  })
}

export interface UpdateProjectPayload {
  input: UpdateProjectInput
  reason?: string
}

export function useUpdateProject(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ input, reason }: UpdateProjectPayload) =>
      projectRepository.update(id, input, {
        actorId: DEMO_CURRENT_USER.id,
        source: 'manual',
        reason,
      }),
    onSuccess: (result) => {
      invalidateProjectData(queryClient)

      if (!result.changed || !result.version) {
        toast.info('Sin cambios', {
          description: 'No se registró una nueva versión del proyecto.',
        })
        return
      }

      const fields = `${result.changes.length} ${
        result.changes.length === 1 ? 'campo' : 'campos'
      }`
      const alerts =
        result.alerts.length > 0
          ? ` · ${result.alerts.length} ${
              result.alerts.length === 1
                ? 'alerta generada'
                : 'alertas generadas'
            }`
          : ''

      toast.success('Proyecto actualizado. Se registró una nueva versión.', {
        description: `${result.project.code} · v${result.version.versionNumber} · ${fields}${alerts}`,
      })
    },
    onError: (error) => {
      toast.error(messageFrom(error, 'No pudimos guardar los cambios.'))
    },
  })
}

export function useArchiveProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => projectRepository.archive(id),
    onSuccess: () => {
      invalidateProjectData(queryClient)
      toast.success('Proyecto archivado.', {
        description: 'Puedes consultarlo activando “Incluir archivados”.',
      })
    },
    onError: (error) => {
      toast.error(messageFrom(error, 'No pudimos archivar el proyecto.'))
    },
  })
}
