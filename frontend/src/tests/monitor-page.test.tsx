import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { Providers } from '@/app/providers'
import { MonitorPage } from '@/features/monitoring/monitor-page'

function renderMonitor(path = '/monitor') {
  return render(
    <Providers>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/monitor" element={<MonitorPage />} />
        </Routes>
      </MemoryRouter>
    </Providers>,
  )
}

describe('MonitorPage', () => {
  it('renders the change feed', async () => {
    renderMonitor()

    expect(
      await screen.findByRole(
        'heading',
        { name: 'Monitor de cambios', level: 1 },
        { timeout: 8000 },
      ),
    ).toBeInTheDocument()

    expect(await screen.findByText(/cambios registrados/)).toBeInTheDocument()
    expect((await screen.findAllByText('Presupuesto:')).length).toBeGreaterThan(
      0,
    )
  })

  it('applies the field filter from the URL', async () => {
    renderMonitor('/monitor?campo=budget')

    expect(
      await screen.findByRole(
        'heading',
        { name: 'Monitor de cambios', level: 1 },
        { timeout: 8000 },
      ),
    ).toBeInTheDocument()

    expect((await screen.findAllByText('Presupuesto:')).length).toBeGreaterThan(
      0,
    )
    expect(screen.queryByText('Fecha de entrega:')).not.toBeInTheDocument()
  })
})
