import { describe, expect, it } from 'vitest'
import {
  formatCurrency,
  formatPercentage,
  formatSignedCurrency,
  percentageChange,
  toCents,
} from '@/domain/utils/money'

describe('money utils', () => {
  it('formats cents as Peruvian soles without decimals', () => {
    expect(formatCurrency(240_000_000)).toContain('2,400,000')
  })

  it('converts soles to cents without floating point drift', () => {
    expect(toCents(2400.1)).toBe(240_010)
    expect(toCents(0.07)).toBe(7)
  })

  it('calculates the variation between two budgets', () => {
    expect(percentageChange(2_400_000, 2_880_000)).toBeCloseTo(20, 5)
  })

  it('returns null when the previous budget is zero', () => {
    expect(percentageChange(0, 320_000)).toBeNull()
  })

  it('formats percentages with a sign and a Spanish decimal separator', () => {
    expect(formatPercentage(12.345)).toBe('+12,3 %')
    expect(formatPercentage(-3)).toBe('-3,0 %')
    expect(formatPercentage(null)).toBe('—')
  })

  it('formats signed currency deltas', () => {
    expect(formatSignedCurrency(1200)).toContain('+')
    expect(formatSignedCurrency(-1200)).toContain('−')
  })
})
