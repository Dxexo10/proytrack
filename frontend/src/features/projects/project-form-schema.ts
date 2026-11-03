import { z } from 'zod'
import type { CreateProjectInput } from '@/data'
import {
  PROJECT_PRIORITIES,
  PROJECT_STATUSES,
  SECTORS,
  type Project,
} from '@/domain/models'
import { centsToSoles, toCents } from '@/domain/utils/money'

const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/

function numericField(
  label: string,
  minimum: number,
  maximum: number,
  integer = false,
) {
  return z
    .string()
    .trim()
    .min(1, `Ingresa ${label}.`)
    .refine((value) => Number.isFinite(Number(value)), `Ingresa ${label}.`)
    .refine(
      (value) => Number(value) >= minimum,
      `No puede ser menor que ${minimum}.`,
    )
    .refine(
      (value) => Number(value) <= maximum,
      `No puede ser mayor que ${maximum}.`,
    )
    .refine(
      (value) => !integer || Number.isInteger(Number(value)),
      'Debe ser un número entero.',
    )
}

export const projectFormSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(3, 'El nombre debe tener al menos 3 caracteres.')
      .max(90, 'El nombre no puede superar 90 caracteres.'),
    client: z
      .string()
      .trim()
      .min(2, 'Indica el cliente.')
      .max(80, 'El cliente no puede superar 80 caracteres.'),
    description: z
      .string()
      .trim()
      .min(10, 'La descripción debe tener al menos 10 caracteres.')
      .max(600, 'La descripción no puede superar 600 caracteres.'),
    sector: z.enum(SECTORS),
    ownerId: z.string().min(1, 'Selecciona un responsable.'),
    status: z.enum(PROJECT_STATUSES),
    priority: z.enum(PROJECT_PRIORITIES),
    initialBudget: numericField('el presupuesto inicial', 0, 1_000_000_000),
    currentBudget: numericField('el presupuesto actual', 0, 1_000_000_000),
    progress: numericField('el avance', 0, 100, true),
    startDate: z
      .string()
      .regex(DATE_PATTERN, 'Indica una fecha de inicio válida.'),
    dueDate: z
      .string()
      .regex(DATE_PATTERN, 'Indica una fecha de entrega válida.'),
    completedAt: z.string(),
    tags: z.string().max(180, 'Usa menos etiquetas.'),
  })
  .superRefine((values, ctx) => {
    if (values.dueDate < values.startDate) {
      ctx.addIssue({
        code: 'custom',
        path: ['dueDate'],
        message: 'La entrega no puede ser anterior al inicio.',
      })
    }

    if (values.status === 'completed') {
      if (Number(values.progress) !== 100) {
        ctx.addIssue({
          code: 'custom',
          path: ['progress'],
          message: 'Un proyecto completado debe tener 100 % de avance.',
        })
      }
      if (!values.completedAt) {
        ctx.addIssue({
          code: 'custom',
          path: ['completedAt'],
          message: 'Indica la fecha de cierre real.',
        })
      }
    }

    const tags = parseTags(values.tags)
    if (tags.length > 6) {
      ctx.addIssue({
        code: 'custom',
        path: ['tags'],
        message: 'Usa como máximo 6 etiquetas.',
      })
    }
  })

export type ProjectFormValues = z.infer<typeof projectFormSchema>

export function parseTags(value: string): string[] {
  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean)
}

export function toProjectInput(values: ProjectFormValues): CreateProjectInput {
  return {
    name: values.name.trim(),
    description: values.description.trim(),
    sector: values.sector,
    client: values.client.trim(),
    ownerId: values.ownerId,
    status: values.status,
    priority: values.priority,
    initialBudgetCents: toCents(Number(values.initialBudget)),
    currentBudgetCents: toCents(Number(values.currentBudget)),
    currency: 'PEN',
    progress: Number(values.progress),
    startDate: values.startDate,
    dueDate: values.dueDate,
    completedAt:
      values.status === 'completed' ? values.completedAt || null : null,
    tags: parseTags(values.tags),
  }
}

export function toFormValues(project: Project): ProjectFormValues {
  return {
    name: project.name,
    client: project.client,
    description: project.description,
    sector: project.sector,
    ownerId: project.ownerId,
    status: project.status,
    priority: project.priority,
    initialBudget: String(centsToSoles(project.initialBudgetCents)),
    currentBudget: String(centsToSoles(project.currentBudgetCents)),
    progress: String(project.progress),
    startDate: project.startDate,
    dueDate: project.dueDate,
    completedAt: project.completedAt ?? '',
    tags: project.tags.join(', '),
  }
}
