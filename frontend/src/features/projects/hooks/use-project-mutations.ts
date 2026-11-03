import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  projectRepository,
  type CreateProjectInput,
  type UpdateProjectInput,
} from '@/data'

function invalidateProjectData(queryClient: ReturnType<typeof useQueryClient>) {
  void queryClient.invalidateQueries({ queryKey: ['projects'] })
  void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
  void queryClient.invalidateQueries({ queryKey: ['alerts'] })
}

function messageFrom(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback
}

export function useCreateProject() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateProjectInput) => projectRepository.create(input),
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

export function useUpdateProject(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateProjectInput) =>
      projectRepository.update(id, input),
    onSuccess: (project) => {
      invalidateProjectData(queryClient)
      toast.success('Proyecto actualizado.', {
        description: `${project.code} · ${project.name}`,
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
