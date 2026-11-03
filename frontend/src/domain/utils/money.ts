const CURRENCY_FORMATTER = new Intl.NumberFormat('es-PE', {
  style: 'currency',
  currency: 'PEN',
  maximumFractionDigits: 0,
})

const COMPACT_CURRENCY_FORMATTER = new Intl.NumberFormat('es-PE', {
  style: 'currency',
  currency: 'PEN',
  notation: 'compact',
  maximumFractionDigits: 1,
})

export function centsToSoles(cents: number): number {
  return cents / 100
}

export function toCents(soles: number): number {
  return Math.round(soles * 100)
}

export function formatCurrency(cents: number): string {
  return CURRENCY_FORMATTER.format(centsToSoles(cents))
}

export function formatCompactCurrency(cents: number): string {
  return COMPACT_CURRENCY_FORMATTER.format(centsToSoles(cents))
}

export function formatSignedCurrency(cents: number): string {
  const formatted = formatCurrency(Math.abs(cents))
  if (cents === 0) return formatted
  return `${cents > 0 ? '+' : '−'}${formatted}`
}

export function percentageChange(
  previous: number,
  current: number,
): number | null {
  if (previous === 0) return null
  return ((current - previous) / previous) * 100
}

export function formatPercentage(value: number | null, digits = 1): string {
  if (value === null || Number.isNaN(value)) return '—'
  const rounded = value.toFixed(digits).replace('.', ',')
  const sign = value > 0 ? '+' : ''
  return `${sign}${rounded} %`
}
