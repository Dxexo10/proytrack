export interface PageQuery {
  page?: number
  pageSize?: number
}

export interface Paginated<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

export const DEFAULT_PAGE_SIZE = 20

export function paginate<T>(
  items: readonly T[],
  query: PageQuery = {},
): Paginated<T> {
  const pageSize = query.pageSize ?? DEFAULT_PAGE_SIZE
  const page = Math.max(1, query.page ?? 1)
  const start = (page - 1) * pageSize

  return {
    items: items.slice(start, start + pageSize),
    total: items.length,
    page,
    pageSize,
  }
}
