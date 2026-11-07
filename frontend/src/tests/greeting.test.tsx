import { act, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useGreeting } from '@/hooks/use-greeting'
import {
  getGreeting,
  millisecondsUntilNextGreetingBoundary,
} from '@/lib/greeting'

function GreetingProbe() {
  return <p>{useGreeting()}</p>
}

describe('getGreeting', () => {
  it.each([
    [0, 'Buenas noches'],
    [4, 'Buenas noches'],
    [5, 'Buenos días'],
    [11, 'Buenos días'],
    [12, 'Buenas tardes'],
    [18, 'Buenas tardes'],
    [19, 'Buenas noches'],
    [23, 'Buenas noches'],
  ])('maps hour %i to %s', (hour, expected) => {
    expect(getGreeting(hour)).toBe(expected)
  })
})

describe('millisecondsUntilNextGreetingBoundary', () => {
  it.each([
    [new Date(2026, 0, 1, 4, 59, 0), 60_000],
    [new Date(2026, 0, 1, 11, 59, 0), 60_000],
    [new Date(2026, 0, 1, 18, 59, 0), 60_000],
    [new Date(2026, 0, 1, 23, 59, 0), 5 * 60 * 60 * 1000 + 60_000],
  ])('schedules the next boundary from %s', (now, expected) => {
    expect(millisecondsUntilNextGreetingBoundary(now)).toBe(expected)
  })
})

describe('useGreeting', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date(2026, 0, 1, 11, 59, 0))
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('updates automatically when the time band changes', () => {
    render(<GreetingProbe />)

    expect(screen.getByText('Buenos días')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(60_000)
    })

    expect(screen.getByText('Buenas tardes')).toBeInTheDocument()
  })
})
