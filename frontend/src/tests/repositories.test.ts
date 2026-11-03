import { describe, expect, it } from 'vitest'
import { alertRepository, projectRepository } from '@/data'

describe('mock repositories over IndexedDB', () => {
  it('seeds the demo dataset only once', async () => {
    const first = await projectRepository.getAll()
    const second = await projectRepository.getAll()

    expect(first).toHaveLength(50)
    expect(first.map((project) => project.id)).toEqual(
      second.map((project) => project.id),
    )
  })

  it('filters and paginates projects', async () => {
    const page = await projectRepository.list({
      page: 1,
      pageSize: 5,
      status: ['in_progress'],
    })

    expect(page.items).toHaveLength(5)
    expect(page.items.every((project) => project.status === 'in_progress')).toBe(
      true,
    )
    expect(page.total).toBeGreaterThan(5)
  })

  it('searches projects by name or code', async () => {
    const result = await projectRepository.list({ search: 'PRJ-001' })

    expect(result.items).toHaveLength(1)
    expect(result.items[0]?.code).toBe('PRJ-001')
  })

  it('returns a project by id and null for unknown ids', async () => {
    const [first] = (await projectRepository.getAll()).slice(0, 1)

    expect(first).toBeDefined()
    await expect(projectRepository.getById(first!.id)).resolves.toMatchObject({
      id: first!.id,
    })
    await expect(projectRepository.getById('prj_missing')).resolves.toBeNull()
  })

  it('counts open alerts', async () => {
    const open = await alertRepository.countOpen()
    const all = await alertRepository.getAll()

    expect(open).toBeGreaterThan(0)
    expect(open).toBeLessThanOrEqual(all.length)
  })
})
