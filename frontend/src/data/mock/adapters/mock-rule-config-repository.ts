import type { RuleConfigRepository } from '@/data/contracts'
import type { RuleConfig } from '@/domain/models'
import { getDatabase } from '../storage/db'
import { withLatency } from './latency'

export class MockRuleConfigRepository implements RuleConfigRepository {
  async list(): Promise<RuleConfig[]> {
    const db = await getDatabase()
    return withLatency(await db.getAll('rules'))
  }

  async update(
    id: string,
    patch: Partial<Omit<RuleConfig, 'id' | 'ruleKey'>>,
  ): Promise<RuleConfig> {
    const db = await getDatabase()
    const existing = await db.get('rules', id)

    if (!existing) {
      throw new Error('La regla solicitada no existe.')
    }

    const updated: RuleConfig = { ...existing, ...patch }
    await db.put('rules', updated)
    return withLatency(updated)
  }
}
