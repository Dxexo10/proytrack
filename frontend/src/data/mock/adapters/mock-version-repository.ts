import type { VersionQuery, VersionRepository } from '@/data/contracts'
import { paginate } from '@/data/contracts'
import type { ProjectVersion } from '@/domain/models'
import { getDatabase } from '../storage/db'
import { withLatency } from './latency'

function byChangedAtDesc(a: ProjectVersion, b: ProjectVersion): number {
  return b.changedAt.localeCompare(a.changedAt)
}

export class MockVersionRepository implements VersionRepository {
  async getAll(): Promise<ProjectVersion[]> {
    const db = await getDatabase()
    return withLatency(await db.getAll('versions'))
  }

  async getById(id: string): Promise<ProjectVersion | null> {
    const db = await getDatabase()
    const version = await db.get('versions', id)
    return withLatency(version ?? null)
  }

  async listByProject(projectId: string): Promise<ProjectVersion[]> {
    const db = await getDatabase()
    const versions = await db.getAll('versions')

    return withLatency(
      versions
        .filter((version) => version.projectId === projectId)
        .sort(byChangedAtDesc),
    )
  }

  async list(query: VersionQuery = {}) {
    const db = await getDatabase()
    const versions = await db.getAll('versions')

    const filtered = versions.filter((version) => {
      if (query.projectId && version.projectId !== query.projectId) return false
      if (query.from && version.changedAt < query.from) return false
      if (query.to && version.changedAt > query.to) return false
      return true
    })

    return withLatency(paginate([...filtered].sort(byChangedAtDesc), query))
  }
}
