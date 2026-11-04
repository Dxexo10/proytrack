import { expect, type Page } from '@playwright/test'

export async function resetDemo(page: Page) {
  await page.goto('/settings')
  await page.getByRole('button', { name: /Restablecer datos/i }).click()
  await page.getByRole('button', { name: 'Restablecer demo' }).click()
  await expect(page.getByText('Datos demo restablecidos.')).toBeVisible()
}
