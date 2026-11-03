import type { AlertSeverity } from './alert'

export interface RuleConfig {
  id: string
  ruleKey: string
  enabled: boolean
  threshold: number | null
  severity: AlertSeverity
}
