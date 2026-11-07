export type Greeting = 'Buenos días' | 'Buenas tardes' | 'Buenas noches'

export const GREETING_BOUNDARY_HOURS = [5, 12, 19] as const

export function getGreeting(hour: number): Greeting {
  if (hour >= 5 && hour < 12) return 'Buenos días'
  if (hour >= 12 && hour < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

export function greetingForDate(date: Date): Greeting {
  return getGreeting(date.getHours())
}

export function millisecondsUntilNextGreetingBoundary(now: Date): number {
  for (const hour of GREETING_BOUNDARY_HOURS) {
    const candidate = new Date(now)
    candidate.setHours(hour, 0, 0, 0)

    if (candidate.getTime() > now.getTime()) {
      return candidate.getTime() - now.getTime()
    }
  }

  const tomorrow = new Date(now)
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(GREETING_BOUNDARY_HOURS[0], 0, 0, 0)
  return tomorrow.getTime() - now.getTime()
}
