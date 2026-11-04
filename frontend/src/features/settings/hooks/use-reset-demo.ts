import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { resetDemoData } from '@/data'

function messageFrom(error: unknown, fallback: string): string {
  return error instanceof Error ? error.message : fallback
}

export function useResetDemo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => resetDemoData(),
    onSuccess: async () => {
      await queryClient.invalidateQueries()
      toast.success('Datos demo restablecidos.', {
        description: 'El portafolio volvió a su estado inicial.',
      })
    },
    onError: (error) => {
      toast.error(messageFrom(error, 'No pudimos restablecer los datos demo.'))
    },
  })
}
