import type { ActivityLog } from '@/domain/models'
import type { PageQuery, Paginated } from './common'

export interface ActivityQuery extends PageQuery {
  projectId?: string
  actorId?: string
  createdAfter?: string
}

export interface ActivityRepository {
  list(query: ActivityQuery): Promise<Paginated<ActivityLog>>
  getAll(): Promise<ActivityLog[]>
}
