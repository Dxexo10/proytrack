import type { ActivityLog, ActivitySource } from '@/domain/models'
import type { PageQuery, Paginated } from './common'

export interface ActivityQuery extends PageQuery {
  projectId?: string
  actorId?: string
  action?: string
  source?: ActivitySource[]
  createdAfter?: string
}

export interface ActivityRepository {
  list(query: ActivityQuery): Promise<Paginated<ActivityLog>>
  getAll(): Promise<ActivityLog[]>
}
