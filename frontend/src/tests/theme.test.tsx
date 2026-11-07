import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { ThemeProvider } from '@/app/theme-provider'
import { useTheme } from '@/app/theme-context'
import { THEME_STORAGE_KEY } from '@/lib/theme'

const originalMatchMedia = window.matchMedia

let systemPrefersDark = false
let mediaListeners: Array<(event: MediaQueryListEvent) => void> = []

function setSystemPrefersDark(value: boolean) {
  systemPrefersDark = value
  const event = { matches: value } as MediaQueryListEvent
  mediaListeners.forEach((listener) => listener(event))
}

function mockSystemTheme() {
  window.matchMedia = ((query: string) => ({
    get matches() {
      return query.includes('prefers-color-scheme: dark')
        ? systemPrefersDark
        : false
    },
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: (
      _type: string,
      listener: (event: MediaQueryListEvent) => void,
    ) => {
      mediaListeners.push(listener)
    },
    removeEventListener: (
      _type: string,
      listener: (event: MediaQueryListEvent) => void,
    ) => {
      mediaListeners = mediaListeners.filter((item) => item !== listener)
    },
    dispatchEvent: () => false,
  })) as typeof window.matchMedia
}

function ThemeProbe() {
  const { theme, resolvedTheme, setTheme } = useTheme()

  return (
    <div>
      <p>{`${theme}:${resolvedTheme}`}</p>
      <button type="button" onClick={() => setTheme('light')}>
        Tema claro
      </button>
      <button type="button" onClick={() => setTheme('dark')}>
        Tema oscuro
      </button>
      <button type="button" onClick={() => setTheme('system')}>
        Tema sistema
      </button>
    </div>
  )
}

function renderProvider() {
  return render(
    <ThemeProvider>
      <ThemeProbe />
    </ThemeProvider>,
  )
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    systemPrefersDark = false
    mediaListeners = []
    window.localStorage.clear()
    document.documentElement.classList.remove('dark')
    document.documentElement.style.colorScheme = ''
    mockSystemTheme()
  })

  afterEach(() => {
    window.matchMedia = originalMatchMedia
  })

  it('restores the persisted dark theme on mount', () => {
    window.localStorage.setItem(THEME_STORAGE_KEY, 'dark')

    renderProvider()

    expect(screen.getByText('dark:dark')).toBeInTheDocument()
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(document.documentElement.style.colorScheme).toBe('dark')
  })

  it('applies and persists an explicit theme selection', async () => {
    const user = userEvent.setup()
    renderProvider()

    expect(screen.getByText('system:light')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Tema oscuro' }))

    expect(screen.getByText('dark:dark')).toBeInTheDocument()
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark')

    await user.click(screen.getByRole('button', { name: 'Tema claro' }))

    expect(screen.getByText('light:light')).toBeInTheDocument()
    expect(document.documentElement.classList.contains('dark')).toBe(false)
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe('light')
  })

  it('follows the system preference when using the system theme', async () => {
    const user = userEvent.setup()
    renderProvider()

    await user.click(screen.getByRole('button', { name: 'Tema sistema' }))
    expect(screen.getByText('system:light')).toBeInTheDocument()

    act(() => setSystemPrefersDark(true))

    expect(screen.getByText('system:dark')).toBeInTheDocument()
    expect(document.documentElement.classList.contains('dark')).toBe(true)

    act(() => setSystemPrefersDark(false))

    expect(screen.getByText('system:light')).toBeInTheDocument()
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })
})
