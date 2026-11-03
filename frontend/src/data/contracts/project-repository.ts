import type {
  Project,
  ProjectPriority,
  ProjectStatus,
  ProjectVersion,
  Sector,
} from '@/domain/models'
import type { PageQuery, Paginated } from './common'

export type ProjectSortField = 'name' | 'updatedAt' | 'dueDate' | 'budget'

export interface ProjectQuery extends PageQuery {
  search?: string
  status?: ProjectStatus[]
  priority?: ProjectPriority[]
  sector?: Sector[]
  ownerId?: string
  createdAfter?: string
  includeArchived?: boolean
  sortBy?: ProjectSortField
  sortDirection?: 'asc' | 'desc'
}

export type CreateProjectInput = Omit<
  Project,
  'id' | 'code' | 'createdAt' | 'updatedAt' | 'archivedAt'
>

export type UpdateProjectInput = Partial<
  Omit<Project, 'id' | 'code' | 'createdAt'>
>

export interface ProjectRepository {
  list(query: ProjectQuery): Promise<Paginated<Project>>
  getAll(): Promise<Project[]>
  getById(id: string): Promise<Project | null>
  create(input: CreateProjectInput): Promise<Project>
  update(id: string, input: UpdateProjectInput): Promise<Project>
  archive(id: string): Promise<void>
  listVersions(id: string): Promise<ProjectVersion[]>
}
