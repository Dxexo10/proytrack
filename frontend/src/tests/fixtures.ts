import type { Project, ProjectStatus } from '@/domain/models'

export function createProject(overrides: Partial<Project> = {}): Project {
  return {
    id: 'prj_test_0001',
    code: 'PRJ-001',
    name: 'Implementación de ERP corporativo',
    description: 'Proyecto de prueba.',
    sector: 'technology',
    client: 'Grupo Andino',
    ownerId: 'usr_0001',
    status: 'in_progress' satisfies ProjectStatus,
    priority: 'medium',
    initialBudgetCents: 240_000_000,
    currentBudgetCents: 288_000_000,
    currency: 'PEN',
    progress: 55,
    startDate: '2026-01-15',
    dueDate: '2026-09-30',
    completedAt: null,
    tags: ['ERP'],
    createdAt: '2026-01-10T09:00:00.000Z',
    updatedAt: '2026-10-20T09:00:00.000Z',
    archivedAt: null,
    ...overrides,
  }
}
