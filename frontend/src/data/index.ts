import type {
  ActivityRepository,
  AlertRepository,
  ProjectRepository,
} from './contracts'
import { MockActivityRepository } from './mock/adapters/mock-activity-repository'
import { MockAlertRepository } from './mock/adapters/mock-alert-repository'
import { MockProjectRepository } from './mock/adapters/mock-project-repository'

export const projectRepository: ProjectRepository = new MockProjectRepository()
export const alertRepository: AlertRepository = new MockAlertRepository()
export const activityRepository: ActivityRepository =
  new MockActivityRepository()

export { resetDemoData } from './mock/storage/db'
export * from './contracts'
