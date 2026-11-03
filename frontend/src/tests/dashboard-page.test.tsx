import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { Providers } from '@/app/providers'
import { DashboardPage } from '@/features/dashboard/dashboard-page'

describe('DashboardPage', () => {
  it('renders the executive summary using the mock repository', async () => {
    render(
      <Providers>
        <MemoryRouter initialEntries={['/dashboard']}>
          <DashboardPage />
        </MemoryRouter>
      </Providers>,
    )

    expect(
      await screen.findByRole(
        'heading',
        { name: 'Resumen general', level: 1 },
        { timeout: 8000 },
      ),
    ).toBeInTheDocument()

    expect(await screen.findByText('Total de proyectos')).toBeInTheDocument()
    expect(await screen.findByText('Proyectos que requieren atención')).toBeInTheDocument()
    expect(await screen.findByText('Actividad reciente')).toBeInTheDocument()
  })
})
