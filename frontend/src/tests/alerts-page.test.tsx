import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { Providers } from '@/app/providers'
import { AlertsPage } from '@/features/alerts/alerts-page'

function renderAlerts(path = '/alerts') {
  return render(
    <Providers>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/alerts" element={<AlertsPage />} />
        </Routes>
      </MemoryRouter>
    </Providers>,
  )
}

describe('AlertsPage', () => {
  it('renders the counters and alert list', async () => {
    renderAlerts()

    expect(
      await screen.findByRole(
        'heading',
        { name: 'Centro de alertas', level: 1 },
        { timeout: 8000 },
      ),
    ).toBeInTheDocument()

    expect(await screen.findByText('Abiertas')).toBeInTheDocument()
    expect(screen.getByText('Críticas abiertas')).toBeInTheDocument()
    expect(screen.getByText('Revisadas')).toBeInTheDocument()
    expect(screen.getByText('Resueltas')).toBeInTheDocument()
  })

  it('marks an alert as reviewed', async () => {
    const user = userEvent.setup()
    renderAlerts()

    await screen.findByRole(
      'heading',
      { name: 'Centro de alertas', level: 1 },
      { timeout: 8000 },
    )

    const reviewButtons = await screen.findAllByRole('button', {
      name: 'Revisar',
    })
    expect(reviewButtons.length).toBeGreaterThan(0)

    await user.click(reviewButtons[0] as HTMLElement)

    expect(
      await screen.findByText('Alerta marcada como revisada.'),
    ).toBeInTheDocument()
  })
})
