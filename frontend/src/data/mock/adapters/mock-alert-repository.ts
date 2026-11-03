import type { AlertQuery, AlertRepository } from '@/data/contracts'
import { paginate } from '@/data/contracts'
import type { Alert, AlertStatus } from '@/domain/models'
import { getDatabase } from '../storage/db'
import { withLatency } from './latency'

export class MockAlertRepository implements AlertRepository {
  async list(query: AlertQuery) {
    const db = await getDatabase()
    const alerts = await db.getAll('alerts')

    const filtered = alerts.filter((alert) => {
      if (query.status && query.status.length > 0) {
        if (!query.status.includes(alert.status)) return false
      }
      if (query.severity && query.severity.length > 0) {
        if (!query.severity.includes(alert.severity)) return false
      }
      if (query.projectId && alert.projectId !== query.projectId) return false
      if (query.createdAfter && alert.createdAt < query.createdAfter) return false
      return true
    })

    const sorted = [...filtered].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    )

    return withLatency(paginate(sorted, query))
  }

  async getAll(): Promise<Alert[]> {
    const db = await getDatabase()
    return withLatency(await db.getAll('alerts'))
  }

  async getById(id: string): Promise<Alert | null> {
    const db = await getDatabase()
    const alert = await db.get('alerts', id)
    return withLatency(alert ?? null)
  }

  async updateStatus(id: string, status: AlertStatus): Promise<Alert> {
    const db = await getDatabase()
    const existing = await db.get('alerts', id)

    if (!existing) {
      throw new Error('La alerta solicitada no existe.')
    }

    const now = new Date().toISOString()
    const updated: Alert = {
      ...existing,
      status,
      reviewedAt: status === 'open' ? null : now,
      resolvedAt: status === 'resolved' ? now : null,
    }

    await db.put('alerts', updated)
    return withLatency(updated)
  }

  async countOpen(): Promise<number> {
    const db = await getDatabase()
    const alerts = await db.getAll('alerts')
    return withLatency(alerts.filter((alert) => alert.status === 'open').length)
  }
}
