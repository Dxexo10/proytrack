import type {
  CreateProjectInput,
  ProjectQuery,
  ProjectRepository,
  UpdateProjectInput,
} from '@/data/contracts'
import { paginate } from '@/data/contracts'
import type { Project, ProjectVersion } from '@/domain/models'
import { getDatabase } from '../storage/db'
import { withLatency } from './latency'

function matchesQuery(project: Project, query: ProjectQuery): boolean {
  if (!query.includeArchived && project.archivedAt !== null) return false

  if (query.search) {
    const term = query.search.trim().toLowerCase()
    if (term.length > 0) {
      const haystack = `${project.name} ${project.code} ${project.client}`.toLowerCase()
      if (!haystack.includes(term)) return false
    }
  }

  if (query.status && query.status.length > 0) {
    if (!query.status.includes(project.status)) return false
  }

  if (query.priority && query.priority.length > 0) {
    if (!query.priority.includes(project.priority)) return false
  }

  if (query.sector && query.sector.length > 0) {
    if (!query.sector.includes(project.sector)) return false
  }

  if (query.ownerId && project.ownerId !== query.ownerId) return false

  if (query.createdAfter && project.createdAt < query.createdAfter) return false

  return true
}

function compareProjects(
  a: Project,
  b: Project,
  sortBy: NonNullable<ProjectQuery['sortBy']>,
): number {
  switch (sortBy) {
    case 'name':
      return a.name.localeCompare(b.name)
    case 'dueDate':
      return a.dueDate.localeCompare(b.dueDate)
    case 'budget':
      return a.currentBudgetCents - b.currentBudgetCents
    case 'updatedAt':
    default:
      return a.updatedAt.localeCompare(b.updatedAt)
  }
}

function nextCode(projects: readonly Project[]): string {
  const highest = projects.reduce((max, project) => {
    const match = /^PRJ-(\d+)$/.exec(project.code)
    return match ? Math.max(max, Number(match[1])) : max
  }, 0)

  return `PRJ-${String(highest + 1).padStart(3, '0')}`
}

export class MockProjectRepository implements ProjectRepository {
  async list(query: ProjectQuery) {
    const db = await getDatabase()
    const projects = await db.getAll('projects')
    const filtered = projects.filter((project) => matchesQuery(project, query))
    const sortBy = query.sortBy ?? 'updatedAt'
    const direction = query.sortDirection === 'asc' ? 1 : -1

    const sorted = [...filtered].sort(
      (a, b) => compareProjects(a, b, sortBy) * direction,
    )

    return withLatency(paginate(sorted, query))
  }

  async getAll(): Promise<Project[]> {
    const db = await getDatabase()
    return withLatency(await db.getAll('projects'))
  }

  async getById(id: string): Promise<Project | null> {
    const db = await getDatabase()
    const project = await db.get('projects', id)
    return withLatency(project ?? null)
  }

  async create(input: CreateProjectInput): Promise<Project> {
    const db = await getDatabase()
    const projects = await db.getAll('projects')
    const now = new Date().toISOString()

    const project: Project = {
      ...input,
      id: `prj_${crypto.randomUUID()}`,
      code: nextCode(projects),
      createdAt: now,
      updatedAt: now,
      archivedAt: null,
    }

    await db.put('projects', project)
    return withLatency(project)
  }

  async update(id: string, input: UpdateProjectInput): Promise<Project> {
    const db = await getDatabase()
    const existing = await db.get('projects', id)

    if (!existing) {
      throw new Error('El proyecto solicitado no existe.')
    }

    const updated: Project = {
      ...existing,
      ...input,
      updatedAt: new Date().toISOString(),
    }

    await db.put('projects', updated)
    return withLatency(updated)
  }

  async archive(id: string): Promise<void> {
    const db = await getDatabase()
    const existing = await db.get('projects', id)

    if (!existing) {
      throw new Error('El proyecto solicitado no existe.')
    }

    const now = new Date().toISOString()
    await db.put('projects', {
      ...existing,
      archivedAt: now,
      updatedAt: now,
    })
    await withLatency(undefined)
  }

  async listVersions(_id: string): Promise<ProjectVersion[]> {
    return withLatency([])
  }
}
