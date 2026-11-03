import { useQuery } from '@tanstack/react-query'
import { alertRepository } from '@/data'

export function useOpenAlertsCount() {
  return useQuery({
    queryKey: ['alerts', 'open-count'],
    queryFn: () => alertRepository.countOpen(),
  })
}
