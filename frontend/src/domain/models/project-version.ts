import type { Project } from './project'

export type VersionSource = 'simulated' | 'manual' | 'system'

export interface ProjectVersion {
  id: string
  projectId: string
  versionNumber: number
  snapshot: Project
  changedAt: string
  changedBy: string
  source: VersionSource
}
