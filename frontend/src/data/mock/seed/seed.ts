import type {
  ActivityLog,
  Alert,
  ChangeEvent,
  Project,
  ProjectVersion,
  RuleConfig,
  User,
} from '@/domain/models'
import { DEMO_SEED } from '@/lib/demo-config'
import { generateActivity } from './activity'
import { generateAlerts } from './alerts'
import { generateProjects } from './projects'
import { createRandom } from './random'
import { generateRuleConfigs } from './rules'
import { DEMO_USERS } from './users'
import { generateVersions } from './versions'

export interface DemoDataset {
  users: User[]
  projects: Project[]
  versions: ProjectVersion[]
  changes: ChangeEvent[]
  alerts: Alert[]
  activity: ActivityLog[]
  rules: RuleConfig[]
}

export function generateDemoDataset(): DemoDataset {
  const random = createRandom(DEMO_SEED)
  const projects = generateProjects(random)
  const { versions, changes } = generateVersions(random, projects)
  const rules = generateRuleConfigs()
  const alerts = generateAlerts(versions, rules)
  const activity = generateActivity(random, projects, alerts, versions)

  return {
    users: DEMO_USERS,
    projects,
    versions,
    changes,
    alerts,
    activity,
    rules,
  }
}
