import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './app/App'

const container = document.getElementById('root')

if (!container) {
  throw new Error('No se encontró el elemento raíz de la aplicación.')
}

createRoot(container).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
