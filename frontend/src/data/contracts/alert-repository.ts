import type { Alert, AlertSeverity, AlertStatus } from '@/domain/models'
import type { PageQuery, Paginated } from './common'

export interface AlertQuery extends PageQuery {
  status?: AlertStatus[]
  severity?: AlertSeverity[]
  projectId?: string
  createdAfter?: string
}

export interface AlertRepository {
  list(query: AlertQuery): Promise<Paginated<Alert>>
  getAll(): Promise<Alert[]>
  getById(id: string): Promise<Alert | null>
  updateStatus(id: string, status: AlertStatus): Promise<Alert>
  countOpen(): Promise<number>
}
