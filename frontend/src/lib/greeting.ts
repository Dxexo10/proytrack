export type TimeBand = 'morning' | 'afternoon' | 'evening'

export type Greeting = 'Buenos días' | 'Buenas tardes' | 'Buenas noches'

export const GREETING_BOUNDARY_HOURS = [5, 12, 19] as const

export const GREETING_SEED_STORAGE_KEY = 'trazo:greeting-seed'

export const GREETING_BY_BAND: Record<TimeBand, Greeting> = {
  morning: 'Buenos días',
  afternoon: 'Buenas tardes',
  evening: 'Buenas noches',
}

export const DASHBOARD_GREETINGS: Record<TimeBand, readonly string[]> = {
  morning: [
    '¡Buenos días, {nombre}!',
    '¡A darle con todo, {nombre}!',
    '¡Un nuevo día, nuevas metas!',
  ],
  afternoon: [
    '¡Buenas tardes, {nombre}!',
    '¡Sigamos avanzando, {nombre}!',
    '¡Vamos por esas metas, {nombre}!',
  ],
  evening: [
    '¡Buenas noches, {nombre}!',
    '¡Qué bueno verte por aquí, {nombre}!',
    '¡La inspiración no tiene horario, {nombre}!',
  ],
}

const BAND_SALT: Record<TimeBand, number> = {
  morning: 0x9e3779b1,
  afternoon: 0x85ebca6b,
  evening: 0xc2b2ae35,
}

let fallbackGreetingSeed: number | null = null

export function getTimeBand(hour: number): TimeBand {
  if (hour >= 5 && hour < 12) return 'morning'
  if (hour >= 12 && hour < 19) return 'afternoon'
  return 'evening'
}

export function getGreeting(hour: number): Greeting {
  return GREETING_BY_BAND[getTimeBand(hour)]
}

export function greetingForDate(date: Date): Greeting {
  return getGreeting(date.getHours())
}

export function timeBandForDate(date: Date): TimeBand {
  return getTimeBand(date.getHours())
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

function createGreetingSeed(): number {
  return Math.floor(Math.random() * 2_147_483_647)
}

/**
 * A stable pseudo-random seed for the browser session. It survives route
 * changes and page reloads inside the same tab, so the dashboard greeting does
 * not change on every render or navigation.
 */
export function readOrCreateGreetingSeed(): number {
  try {
    const stored = window.sessionStorage.getItem(GREETING_SEED_STORAGE_KEY)

    if (stored !== null) {
      const parsed = Number(stored)
      if (Number.isSafeInteger(parsed) && parsed >= 0) return parsed
    }

    const seed = createGreetingSeed()
    window.sessionStorage.setItem(GREETING_SEED_STORAGE_KEY, String(seed))
    return seed
  } catch {
    fallbackGreetingSeed ??= createGreetingSeed()
    return fallbackGreetingSeed
  }
}

export function pickDashboardGreetingIndex(
  band: TimeBand,
  seed: number,
): number {
  let value = (seed ^ BAND_SALT[band]) >>> 0
  value = Math.imul(value ^ (value >>> 16), 0x45d9f3b) >>> 0
  value = Math.imul(value ^ (value >>> 16), 0x45d9f3b) >>> 0
  value = (value ^ (value >>> 16)) >>> 0

  return value % DASHBOARD_GREETINGS[band].length
}

export function buildDashboardGreeting(
  band: TimeBand,
  name: string,
  index: number,
): string {
  const variants = DASHBOARD_GREETINGS[band]
  const variant = variants[index % variants.length] ?? variants[0] ?? ''
  return variant.replaceAll('{nombre}', name)
}
