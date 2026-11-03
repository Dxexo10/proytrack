import type { AlertSeverity } from './alert'

export const RULE_KEYS = [
  'budget-increase-from-zero',
  'budget-increase-critical',
  'budget-increase-warning',
  'deadline-postponed',
  'project-overdue',
  'project-on-hold',
  'priority-critical',
] as const

export type RuleKey = (typeof RULE_KEYS)[number]

export interface RuleConfig {
  id: string
  ruleKey: RuleKey
  enabled: boolean
  threshold: number | null
  severity: AlertSeverity
}

export const DEFAULT_RULE_CONFIGS: readonly RuleConfig[] = [
  {
    id: 'rule_budget_from_zero',
    ruleKey: 'budget-increase-from-zero',
    enabled: true,
    threshold: null,
    severity: 'critical',
  },
  {
    id: 'rule_budget_critical',
    ruleKey: 'budget-increase-critical',
    enabled: true,
    threshold: 20,
    severity: 'critical',
  },
  {
    id: 'rule_budget_warning',
    ruleKey: 'budget-increase-warning',
    enabled: true,
    threshold: 10,
    severity: 'warning',
  },
  {
    id: 'rule_deadline_postponed',
    ruleKey: 'deadline-postponed',
    enabled: true,
    threshold: 0,
    severity: 'warning',
  },
  {
    id: 'rule_project_overdue',
    ruleKey: 'project-overdue',
    enabled: true,
    threshold: 0,
    severity: 'warning',
  },
  {
    id: 'rule_project_on_hold',
    ruleKey: 'project-on-hold',
    enabled: true,
    threshold: null,
    severity: 'critical',
  },
  {
    id: 'rule_priority_critical',
    ruleKey: 'priority-critical',
    enabled: true,
    threshold: null,
    severity: 'warning',
  },
]
