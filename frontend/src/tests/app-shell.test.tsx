import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'
import { Providers } from '@/app/providers'
import { AppShell } from '@/app/layouts/app-shell'

function renderShell() {
  return render(
    <Providers>
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<p>Contenido de prueba</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </Providers>,
  )
}

describe('AppShell', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  it('starts with a compact icon navigation and expands on demand', async () => {
    const user = userEvent.setup()
    renderShell()

    const navigation = screen.getByRole('navigation', {
      name: 'Navegación principal',
    })

    expect(within(navigation).queryByText('Portafolio')).not.toBeInTheDocument()

    const expand = screen.getByRole('button', { name: 'Expandir navegación' })
    await user.click(expand)

    expect(
      screen.getByRole('button', { name: 'Contraer navegación' }),
    ).toBeInTheDocument()
    expect(within(navigation).getByText('Portafolio')).toBeInTheDocument()
    expect(within(navigation).getByText('Proyectos')).toBeInTheDocument()
  })

  it('renders the routed content inside the shell', async () => {
    renderShell()

    expect(await screen.findByText('Contenido de prueba')).toBeInTheDocument()
  })
})
