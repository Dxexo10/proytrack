import type {
  ChangeType,
  ProjectPriority,
  ProjectStatus,
  User,
} from '@/domain/models'
import { formatDate } from '@/domain/utils/date'
import { formatCurrency } from '@/domain/utils/money'
import { PRIORITY_LABELS, STATUS_LABELS } from '@/lib/labels'
import { cn } from '@/lib/utils'

interface ChangeValueProps {
  field: ChangeType
  value: string
  users?: readonly User[]
  className?: string
}

export function ChangeValue({
  field,
  value,
  users = [],
  className,
}: ChangeValueProps) {
  let label = value

  switch (field) {
    case 'budget':
      label = formatCurrency(Number(value))
      break
    case 'deadline':
      label = formatDate(value)
      break
    case 'status':
      label = STATUS_LABELS[value as ProjectStatus] ?? value
      break
    case 'progress':
      label = `${value} %`
      break
    case 'priority':
      label = PRIORITY_LABELS[value as ProjectPriority] ?? value
      break
    case 'owner':
      label = users.find((user) => user.id === value)?.name ?? 'Sin asignar'
      break
  }

  return <span className={cn('tabular-nums', className)}>{label}</span>
}
