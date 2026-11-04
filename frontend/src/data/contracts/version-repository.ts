import type { ProjectVersion } from '@/domain/models'
import type { PageQuery, Paginated } from './common'

export interface VersionQuery extends PageQuery {
  projectId?: string
  from?: string
  to?: string
}

export interface VersionRepository {
  getAll(): Promise<ProjectVersion[]>
  getById(id: string): Promise<ProjectVersion | null>
  listByProject(projectId: string): Promise<ProjectVersion[]>
  list(query?: VersionQuery): Promise<Paginated<ProjectVersion>>
}
