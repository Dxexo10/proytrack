import type { ActivityQuery, ActivityRepository } from '@/data/contracts'
import { paginate } from '@/data/contracts'
import type { ActivityLog } from '@/domain/models'
import { getDatabase } from '../storage/db'
import { withLatency } from './latency'

export class MockActivityRepository implements ActivityRepository {
  async list(query: ActivityQuery) {
    const db = await getDatabase()
    const activity = await db.getAll('activity')

    const filtered = activity.filter((entry) => {
      if (query.projectId && entry.projectId !== query.projectId) return false
      if (query.actorId && entry.actorId !== query.actorId) return false
      if (query.createdAfter && entry.createdAt < query.createdAfter) return false
      return true
    })

    const sorted = [...filtered].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    )

    return withLatency(paginate(sorted, query))
  }

  async getAll(): Promise<ActivityLog[]> {
    const db = await getDatabase()
    return withLatency(await db.getAll('activity'))
  }
}
