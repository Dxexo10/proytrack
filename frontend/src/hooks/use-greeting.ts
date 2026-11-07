import { useEffect, useState } from 'react'
import {
  buildDashboardGreeting,
  GREETING_BY_BAND,
  getTimeBand,
  millisecondsUntilNextGreetingBoundary,
  pickDashboardGreetingIndex,
  readOrCreateGreetingSeed,
  type Greeting,
  type TimeBand,
} from '@/lib/greeting'

function useScheduledTimeBand(): TimeBand {
  const [band, setBand] = useState<TimeBand>(() =>
    getTimeBand(new Date().getHours()),
  )

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>

    const scheduleNextUpdate = () => {
      timeoutId = setTimeout(() => {
        setBand(getTimeBand(new Date().getHours()))
        scheduleNextUpdate()
      }, millisecondsUntilNextGreetingBoundary(new Date()))
    }

    scheduleNextUpdate()

    return () => clearTimeout(timeoutId)
  }, [])

  return band
}

export function useTimeBand(): TimeBand {
  return useScheduledTimeBand()
}

export function useGreeting(): Greeting {
  const band = useScheduledTimeBand()
  return GREETING_BY_BAND[band]
}

export function useDashboardGreeting(name: string): string {
  const band = useScheduledTimeBand()
  const [seed] = useState(readOrCreateGreetingSeed)
  const index = pickDashboardGreetingIndex(band, seed)

  return buildDashboardGreeting(band, name, index)
}
