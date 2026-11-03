import type { ReactElement } from 'react'
import { RouterProvider } from 'react-router-dom'
import { Providers } from './providers'
import { router } from './router'

export function App(): ReactElement {
  return (
    <Providers>
      <RouterProvider router={router} />
    </Providers>
  )
}
