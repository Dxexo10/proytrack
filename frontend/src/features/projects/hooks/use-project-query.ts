import { useQuery } from '@tanstack/react-query'
import {
  activityRepository,
  alertRepository,
  changeEventRepository,
  projectRepository,
  versionRepository,
} from '@/data'

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

export function useProjectVersions(projectId: string | undefined) {
  return useQuery({
    queryKey: ['projects', 'versions', projectId],
    queryFn: () => versionRepository.listByProject(projectId ?? ''),
    enabled: Boolean(projectId),
  })
}

export function useProjectChanges(projectId: string | undefined) {
  return useQuery({
    queryKey: ['projects', 'changes', projectId],
    queryFn: () => changeEventRepository.listByProject(projectId ?? ''),
    enabled: Boolean(projectId),
  })
}
