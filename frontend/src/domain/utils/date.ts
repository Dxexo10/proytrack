const DAY_MS = 86_400_000

export const MONTH_LABELS = [
  'ene',
  'feb',
  'mar',
  'abr',
  'may',
  'jun',
  'jul',
  'ago',
  'sep',
  'oct',
  'nov',
  'dic',
] as const

export function parseDate(value: string): Date {
  return value.length === 10
    ? new Date(`${value}T12:00:00.000Z`)
    : new Date(value)
}

export function toISODate(date: Date): string {
  return date.toISOString().slice(0, 10)
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * DAY_MS)
}

export function addMonths(date: Date, months: number): Date {
  const next = new Date(date.getTime())
  const day = next.getUTCDate()
  next.setUTCDate(1)
  next.setUTCMonth(next.getUTCMonth() + months)
  const lastDay = new Date(
    Date.UTC(next.getUTCFullYear(), next.getUTCMonth() + 1, 0),
  ).getUTCDate()
  next.setUTCDate(Math.min(day, lastDay))
  return next
}

export function shiftMonths(date: Date, months: number): Date {
  const next = new Date(date.getTime())
  next.setUTCDate(1)
  next.setUTCMonth(next.getUTCMonth() + months)
  return next
}

export function startOfMonth(date: Date): Date {
  const next = new Date(date.getTime())
  next.setUTCDate(1)
  next.setUTCHours(12, 0, 0, 0)
  return next
}

export function monthKey(date: Date): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}`
}

export function monthLabel(key: string): string {
  const [, month] = key.split('-')
  const index = Number(month) - 1
  return MONTH_LABELS[index] ?? key
}

export function formatMonthYear(key: string): string {
  const [year, month] = key.split('-')
  const index = Number(month) - 1
  return `${MONTH_LABELS[index] ?? month} ${year}`
}

export function formatDate(value: string): string {
  const date = parseDate(value)
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${day} ${MONTH_LABELS[date.getUTCMonth()]} ${date.getUTCFullYear()}`
}

export function formatLongDate(value: string): string {
  const date = parseDate(value)
  const day = String(date.getUTCDate()).padStart(2, '0')
  return `${day} de ${MONTH_LABELS[date.getUTCMonth()]}. de ${date.getUTCFullYear()}`
}

export function daysBetween(from: string | Date, to: string | Date): number {
  const start = typeof from === 'string' ? parseDate(from) : from
  const end = typeof to === 'string' ? parseDate(to) : to
  return Math.round((end.getTime() - start.getTime()) / DAY_MS)
}

export function isPastDate(value: string, reference: string): boolean {
  return daysBetween(reference, value) < 0
}

export function formatRelative(value: string, reference: string): string {
  const minutes = Math.round(
    (parseDate(reference).getTime() - parseDate(value).getTime()) / 60_000,
  )

  if (minutes < 1) return 'ahora mismo'
  if (minutes < 60) return `hace ${minutes} min`

  const hours = Math.round(minutes / 60)
  if (hours < 24) return `hace ${hours} h`

  const days = Math.round(hours / 24)
  if (days === 1) return 'ayer'
  if (days < 7) return `hace ${days} días`

  const weeks = Math.round(days / 7)
  if (weeks < 5) return `hace ${weeks} ${weeks === 1 ? 'semana' : 'semanas'}`

  const months = Math.round(days / 30)
  if (months < 12) return `hace ${months} ${months === 1 ? 'mes' : 'meses'}`

  const years = Math.round(days / 365)
  return `hace ${years} ${years === 1 ? 'año' : 'años'}`
}
