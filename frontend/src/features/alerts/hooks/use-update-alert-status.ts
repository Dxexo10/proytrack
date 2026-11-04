import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { alertRepository } from '@/data'
import type { AlertStatus } from '@/domain/models'

interface UpdateAlertStatusPayload {
  id: string
  status: AlertStatus
}

function messageFrom(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback
}

export function useUpdateAlertStatus() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, status }: UpdateAlertStatusPayload) =>
      alertRepository.updateStatus(id, status),
    onSuccess: (alert) => {
      void queryClient.invalidateQueries({ queryKey: ['alerts'] })
      void queryClient.invalidateQueries({ queryKey: ['dashboard'] })
      void queryClient.invalidateQueries({ queryKey: ['projects'] })
      void queryClient.invalidateQueries({ queryKey: ['monitor'] })

      toast.success(
        alert.status === 'resolved'
          ? 'Alerta resuelta.'
          : 'Alerta marcada como revisada.',
        { description: alert.title },
      )
    },
    onError: (error) => {
      toast.error(
        messageFrom(error, 'No pudimos actualizar el estado de la alerta.'),
      )
    },
  })
}
