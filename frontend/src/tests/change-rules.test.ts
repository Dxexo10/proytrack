import { describe, expect, it } from 'vitest'
import {
  DEFAULT_RULE_CONFIGS,
  type RuleConfig,
  type RuleKey,
} from '@/domain/models'
import {
  evaluateChangeRules,
  type EvaluateChangeRulesInput,
} from '@/domain/services/change-rules'
import { createProject } from './fixtures'

const REFERENCE_DATE = '2026-10-31'

function base(overrides = {}) {
  return createProject({
    status: 'planned',
    priority: 'medium',
    progress: 0,
    currentBudgetCents: 100_000_000,
    dueDate: '2027-06-30',
    ...overrides,
  })
}

function evaluate(
  previous = base(),
  next = base(),
  options: Partial<Omit<EvaluateChangeRulesInput, 'previous' | 'next'>> = {},
) {
  return evaluateChangeRules({
    previous,
    next,
    referenceDate: REFERENCE_DATE,
    includeTimeRules: false,
    ...options,
  })
}

function withConfig(key: RuleKey, patch: Partial<RuleConfig>): RuleConfig[] {
  return DEFAULT_RULE_CONFIGS.map((config) =>
    config.ruleKey === key ? { ...config, ...patch } : config,
  )
}

describe('evaluateChangeRules — budget', () => {
  it('does not alert at exactly 10 %', () => {
    const previous = base()
    const next = base({ currentBudgetCents: 110_000_000 })

    expect(evaluate(previous, next)).toEqual([])
  })

  it('alerts as a warning at exactly 20 %', () => {
    const previous = base()
    const next = base({ currentBudgetCents: 120_000_000 })
    const drafts = evaluate(previous, next)

    expect(drafts).toHaveLength(1)
    expect(drafts[0]).toMatchObject({
      ruleKey: 'budget-increase-warning',
      severity: 'warning',
    })
  })

  it('alerts as critical above 20 % and never duplicates the warning', () => {
    const previous = base()
    const next = base({ currentBudgetCents: 120_000_100 })
    const drafts = evaluate(previous, next)

    expect(drafts).toHaveLength(1)
    expect(drafts[0]).toMatchObject({
      ruleKey: 'budget-increase-critical',
      severity: 'critical',
    })
  })

  it('uses the from-zero rule when the previous budget was zero', () => {
    const previous = base({ currentBudgetCents: 0 })
    const next = base({ currentBudgetCents: 5_000_000 })
    const drafts = evaluate(previous, next)

    expect(drafts).toHaveLength(1)
    expect(drafts[0]).toMatchObject({
      ruleKey: 'budget-increase-from-zero',
      severity: 'critical',
    })
  })

  it('does not alert when the budget decreases', () => {
    const previous = base()
    const next = base({ currentBudgetCents: 80_000_000 })

    expect(evaluate(previous, next)).toEqual([])
  })

  it('honours custom warning thresholds', () => {
    const previous = base()
    const next = base({ currentBudgetCents: 106_000_000 })

    expect(evaluate(previous, next)).toEqual([])
    expect(
      evaluate(previous, next, {
        ruleConfigs: withConfig('budget-increase-warning', { threshold: 5 }),
      }),
    ).toHaveLength(1)
  })

  it('falls back to the warning rule when the critical rule is disabled', () => {
    const previous = base()
    const next = base({ currentBudgetCents: 130_000_000 })
    const drafts = evaluate(previous, next, {
      ruleConfigs: withConfig('budget-increase-critical', { enabled: false }),
    })

    expect(drafts).toHaveLength(1)
    expect(drafts[0]?.ruleKey).toBe('budget-increase-warning')
  })

  it('skips disabled rules', () => {
    const previous = base()
    const next = base({ currentBudgetCents: 115_000_000 })

    expect(
      evaluate(previous, next, {
        ruleConfigs: withConfig('budget-increase-warning', { enabled: false }),
      }),
    ).toEqual([])
  })
})

describe('evaluateChangeRules — deadline and time rules', () => {
  it('alerts when the due date is postponed', () => {
    const previous = base({ dueDate: '2026-12-01' })
    const next = base({ dueDate: '2026-12-15' })
    const drafts = evaluate(previous, next)

    expect(drafts).toHaveLength(1)
    expect(drafts[0]).toMatchObject({ ruleKey: 'deadline-postponed' })
  })

  it('does not alert when the due date moves earlier', () => {
    const previous = base({ dueDate: '2026-12-15' })
    const next = base({ dueDate: '2026-12-01' })

    expect(evaluate(previous, next)).toEqual([])
  })

  it('evaluates overdue only when time rules are enabled', () => {
    const previous = base({ status: 'in_progress', progress: 40 })
    const next = base({
      status: 'in_progress',
      progress: 40,
      dueDate: '2026-09-30',
    })

    expect(evaluate(previous, next)).toEqual([])

    const withTime = evaluate(previous, next, { includeTimeRules: true })
    expect(withTime).toHaveLength(1)
    expect(withTime[0]).toMatchObject({ ruleKey: 'project-overdue' })
  })

  it('does not mark completed projects as overdue', () => {
    const previous = base({ status: 'in_progress', progress: 90 })
    const next = base({
      status: 'completed',
      progress: 100,
      dueDate: '2026-09-30',
    })

    expect(evaluate(previous, next, { includeTimeRules: true })).toEqual([])
  })
})

describe('evaluateChangeRules — status and priority', () => {
  it('alerts when the status changes to on hold', () => {
    const previous = base({ status: 'in_progress' })
    const next = base({ status: 'on_hold' })
    const drafts = evaluate(previous, next)

    expect(drafts).toHaveLength(1)
    expect(drafts[0]).toMatchObject({
      ruleKey: 'project-on-hold',
      severity: 'critical',
    })
  })

  it('does not repeat the on-hold alert when it was already on hold', () => {
    const previous = base({ status: 'on_hold' })
    const next = base({ status: 'on_hold' })

    expect(evaluate(previous, next)).toEqual([])
  })

  it('alerts when the priority changes to critical', () => {
    const previous = base({ priority: 'high' })
    const next = base({ priority: 'critical' })
    const drafts = evaluate(previous, next)

    expect(drafts).toHaveLength(1)
    expect(drafts[0]).toMatchObject({
      ruleKey: 'priority-critical',
      severity: 'warning',
    })
  })

  it('combines independent rules in one transition', () => {
    const previous = base({ status: 'in_progress', priority: 'medium' })
    const next = base({
      status: 'on_hold',
      priority: 'critical',
      currentBudgetCents: 125_000_000,
      dueDate: '2027-08-30',
    })
    const drafts = evaluate(previous, next)

    expect(drafts.map((draft) => draft.ruleKey)).toEqual([
      'budget-increase-critical',
      'deadline-postponed',
      'project-on-hold',
      'priority-critical',
    ])
  })
})
