import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { Providers } from '@/app/providers'
import { ProjectDetailPage } from '@/features/projects/project-detail-page'

function renderDetail(path = '/projects/prj_0001') {
  return render(
    <Providers>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
        </Routes>
      </MemoryRouter>
    </Providers>,
  )
}

describe('ProjectDetailPage history and comparison', () => {
  it('shows immutable versions and a field-by-field comparison', async () => {
    const user = userEvent.setup()
    renderDetail()

    expect(
      await screen.findByRole(
        'heading',
        { name: 'Implementación de ERP corporativo', level: 1 },
        { timeout: 8000 },
      ),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: 'Historial' }))

    expect(await screen.findByText('Versión 1')).toBeInTheDocument()
    expect(screen.getByText('Historial de versiones')).toBeInTheDocument()

    await user.click(screen.getByRole('tab', { name: 'Comparar versiones' }))

    expect(
      await screen.findByRole('columnheader', { name: 'Antes' }),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('columnheader', { name: 'Después' }),
    ).toBeInTheDocument()
  })

  it('opens the history tab from the URL', async () => {
    renderDetail('/projects/prj_0001?tab=historial')

    expect(
      await screen.findByRole(
        'heading',
        { name: 'Implementación de ERP corporativo', level: 1 },
        { timeout: 8000 },
      ),
    ).toBeInTheDocument()
    expect(await screen.findByText('Versión 1')).toBeInTheDocument()
  })
})
