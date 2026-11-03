import type { DashboardPeriod } from '@/domain/services/dashboard-summary'
import { useSearchParams } from 'react-router-dom'

const PERIODS: DashboardPeriod[] = [3, 6, 12]

export function parsePeriod(value: string | null): DashboardPeriod {
  const parsed = Number(value)
  return PERIODS.includes(parsed as DashboardPeriod)
    ? (parsed as DashboardPeriod)
    : 12
}

export function useDashboardFilters() {
  const [searchParams, setSearchParams] = useSearchParams()
  const period = parsePeriod(searchParams.get('periodo'))

  const setPeriod = (next: DashboardPeriod) => {
    const params = new URLSearchParams(searchParams)
    params.set('periodo', String(next))
    setSearchParams(params, { replace: true })
  }

  return { period, setPeriod }
}

export { PERIODS }
