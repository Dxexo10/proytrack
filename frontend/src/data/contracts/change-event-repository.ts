import type { ChangeEvent, ChangeType } from '@/domain/models'
import type { PageQuery, Paginated } from './common'

export interface ChangeQuery extends PageQuery {
  projectId?: string
  versionId?: string
  field?: ChangeType
}

export interface ChangeEventRepository {
  getAll(): Promise<ChangeEvent[]>
  listByProject(projectId: string): Promise<ChangeEvent[]>
  listByVersion(versionId: string): Promise<ChangeEvent[]>
  list(query?: ChangeQuery): Promise<Paginated<ChangeEvent>>
}
