import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { Providers } from '@/app/providers'
import { SettingsPage } from '@/features/settings/settings-page'

function renderSettings() {
  return render(
    <Providers>
      <MemoryRouter initialEntries={['/settings']}>
        <Routes>
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </MemoryRouter>
    </Providers>,
  )
}

describe('SettingsPage', () => {
  it('renders the demo profile, dataset and rule configuration', async () => {
    renderSettings()

    expect(
      await screen.findByRole(
        'heading',
        { name: 'Configuración demo', level: 1 },
        { timeout: 8000 },
      ),
    ).toBeInTheDocument()

    expect(screen.getByText('Perfil demo')).toBeInTheDocument()
    expect(screen.getByText('Dataset demo')).toBeInTheDocument()
    expect(
      await screen.findByText('Incremento presupuestal crítico'),
    ).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /Restablecer datos/i }),
    ).toBeInTheDocument()
  })
})
