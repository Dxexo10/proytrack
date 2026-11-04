import { DEFAULT_RULE_CONFIGS, type RuleConfig } from '@/domain/models'

export function generateRuleConfigs(): RuleConfig[] {
  return DEFAULT_RULE_CONFIGS.map((config) => ({ ...config }))
}
