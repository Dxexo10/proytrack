import { expect, test } from '@playwright/test'
import { resetDemo } from './helpers'

test.beforeEach(async ({ page }) => {
  await resetDemo(page)
})

test('simula un incremento de presupuesto y lo refleja en el monitor', async ({
  page,
}) => {
  await page.goto('/monitor')

  await page.getByRole('button', { name: 'Simular actualización' }).click()
  await expect(page.getByRole('dialog')).toBeVisible()

  await page.getByRole('combobox', { name: 'Proyecto' }).click()
  await page.getByRole('option', { name: /PRJ-001/ }).click()

  await page.getByRole('button', { name: 'Ejecutar simulación' }).click()

  await expect(page.getByText('Actualización simulada.')).toBeVisible()
  await expect(page.getByText('S/ 4,830,000').first()).toBeVisible()
})
