import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

export interface FilterOption {
  value: string
  label: string
}

interface FilterSelectProps {
  label: string
  value: string
  options: FilterOption[]
  onChange: (value: string) => void
  className?: string
  showLabel?: boolean
}

export function FilterSelect({
  label,
  value,
  options,
  onChange,
  className,
  showLabel = true,
}: FilterSelectProps) {
  const items = Object.fromEntries(
    options.map((option) => [option.value, option.label]),
  )

  return (
    <div className={cn('space-y-1.5', className)}>
      {showLabel ? (
        <Label className="text-[11px] font-semibold tracking-[0.08em] text-muted-foreground uppercase">
          {label}
        </Label>
      ) : null}
      <Select
        items={items}
        value={value}
        onValueChange={(next) => onChange(String(next ?? 'all'))}
      >
        <SelectTrigger
          className="h-9 w-full bg-surface"
          aria-label={label}
        >
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
