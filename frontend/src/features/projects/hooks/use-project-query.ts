import { useQuery } from '@tanstack/react-query'
import { activityRepository, alertRepository, projectRepository } from '@/data'

export function useProjectQuery(id: string | undefined) {
  return useQuery({
    queryKey: ['projects', 'detail', id],
    queryFn: () => projectRepository.getById(id ?? ''),
    enabled: Boolean(id),
  })
}

export function useProjectAlerts(projectId: string | undefined) {
  return useQuery({
    queryKey: ['projects', 'alerts', projectId],
    queryFn: () =>
      alertRepository.list({ projectId: projectId ?? '', pageSize: 20 }),
    enabled: Boolean(projectId),
  })
}

export function useProjectActivity(projectId: string | undefined) {
  return useQuery({
    queryKey: ['projects', 'activity', projectId],
    queryFn: () =>
      activityRepository.list({ projectId: projectId ?? '', pageSize: 8 }),
    enabled: Boolean(projectId),
  })
}
