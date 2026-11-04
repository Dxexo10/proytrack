import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { Providers } from '@/app/providers'
import { ActivityPage } from '@/features/activity/activity-page'

function renderActivity(path = '/activity') {
  return render(
    <Providers>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/activity" element={<ActivityPage />} />
        </Routes>
      </MemoryRouter>
    </Providers>,
  )
}

describe('ActivityPage', () => {
  it('renders the audit timeline and filters', async () => {
    renderActivity()

    expect(
      await screen.findByRole(
        'heading',
        { name: 'Actividad', level: 1 },
        { timeout: 8000 },
      ),
    ).toBeInTheDocument()

    expect((await screen.findAllByText(/eventos/)).length).toBeGreaterThan(0)
    expect(screen.getByText('Usuario')).toBeInTheDocument()
    expect(screen.getByText('Acción')).toBeInTheDocument()
  })

  it('filters by action from the URL', async () => {
    renderActivity('/activity?accion=version.created')

    expect(
      await screen.findByRole(
        'heading',
        { name: 'Actividad', level: 1 },
        { timeout: 8000 },
      ),
    ).toBeInTheDocument()

    expect(
      (await screen.findAllByText(/registró una nueva versión/)).length,
    ).toBeGreaterThan(0)
    expect(screen.queryAllByText(/creó el proyecto/)).toHaveLength(0)
  })
})
