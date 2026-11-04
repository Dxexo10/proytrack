import type { ChangeEventRepository, ChangeQuery } from '@/data/contracts'
import { paginate } from '@/data/contracts'
import type { ChangeEvent } from '@/domain/models'
import { getDatabase } from '../storage/db'
import { withLatency } from './latency'

function byId(a: ChangeEvent, b: ChangeEvent): number {
  return a.id.localeCompare(b.id)
}

export class MockChangeEventRepository implements ChangeEventRepository {
  async getAll(): Promise<ChangeEvent[]> {
    const db = await getDatabase()
    return withLatency(await db.getAll('changes'))
  }

  async listByProject(projectId: string): Promise<ChangeEvent[]> {
    const db = await getDatabase()
    const changes = await db.getAll('changes')

    return withLatency(
      changes.filter((change) => change.projectId === projectId).sort(byId),
    )
  }

  async listByVersion(versionId: string): Promise<ChangeEvent[]> {
    const db = await getDatabase()
    const changes = await db.getAll('changes')

    return withLatency(
      changes.filter((change) => change.versionId === versionId).sort(byId),
    )
  }

  async list(query: ChangeQuery = {}) {
    const db = await getDatabase()
    const changes = await db.getAll('changes')

    const filtered = changes.filter((change) => {
      if (query.projectId && change.projectId !== query.projectId) return false
      if (query.versionId && change.versionId !== query.versionId) return false
      if (query.field && change.field !== query.field) return false
      return true
    })

    return withLatency(paginate([...filtered].sort(byId), query))
  }
}
