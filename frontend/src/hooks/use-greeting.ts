import { useEffect, useState } from 'react'
import {
  greetingForDate,
  millisecondsUntilNextGreetingBoundary,
  type Greeting,
} from '@/lib/greeting'

export function useGreeting(): Greeting {
  const [greeting, setGreeting] = useState<Greeting>(() =>
    greetingForDate(new Date()),
  )

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>

    const scheduleNextUpdate = () => {
      timeoutId = setTimeout(() => {
        setGreeting(greetingForDate(new Date()))
        scheduleNextUpdate()
      }, millisecondsUntilNextGreetingBoundary(new Date()))
    }

    scheduleNextUpdate()

    return () => clearTimeout(timeoutId)
  }, [])

  return greeting
}
