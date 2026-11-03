import type { ActivityLog, Alert, Project, User } from '@/domain/models'
import { DEMO_SEED } from '@/lib/demo-config'
import { generateActivity } from './activity'
import { generateAlerts } from './alerts'
import { generateProjects } from './projects'
import { createRandom } from './random'
import { DEMO_USERS } from './users'

export interface DemoDataset {
  users: User[]
  projects: Project[]
  alerts: Alert[]
  activity: ActivityLog[]
}

export function generateDemoDataset(): DemoDataset {
  const random = createRandom(DEMO_SEED)
  const projects = generateProjects(random)
  const alerts = generateAlerts(random, projects)
  const activity = generateActivity(random, projects, alerts)

  return { users: DEMO_USERS, projects, alerts, activity }
}
