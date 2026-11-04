import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ruleConfigRepository } from '@/data'
import type { RuleConfig } from '@/domain/models'

export function useRuleConfigs() {
  return useQuery({
    queryKey: ['rules', 'configs'],
    queryFn: () => ruleConfigRepository.list(),
  })
}

interface SaveRuleConfigsPayload {
  configs: RuleConfig[]
}

export function useSaveRuleConfigs() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ configs }: SaveRuleConfigsPayload) =>
      Promise.all(
        configs.map((config) =>
          ruleConfigRepository.update(config.id, {
            enabled: config.enabled,
            threshold: config.threshold,
            severity: config.severity,
          }),
        ),
      ),
    onSuccess: (configs) => {
      void queryClient.invalidateQueries({ queryKey: ['rules'] })
      toast.success('Reglas actualizadas.', {
        description: `${configs.length} reglas listas para las próximas versiones.`,
      })
    },
    onError: (error) => {
      toast.error(
        error instanceof Error
          ? error.message
          : 'No pudimos guardar la configuración de reglas.',
      )
    },
  })
}
