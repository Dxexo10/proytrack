import type { RuleConfig } from '@/domain/models'

export interface RuleConfigRepository {
  list(): Promise<RuleConfig[]>
  update(
    id: string,
    patch: Partial<Omit<RuleConfig, 'id' | 'ruleKey'>>,
  ): Promise<RuleConfig>
}
