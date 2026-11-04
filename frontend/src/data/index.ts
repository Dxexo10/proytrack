import type {
  ActivityRepository,
  AlertRepository,
  ChangeEventRepository,
  ProjectRepository,
  RuleConfigRepository,
  VersionRepository,
} from './contracts'
import { MockActivityRepository } from './mock/adapters/mock-activity-repository'
import { MockAlertRepository } from './mock/adapters/mock-alert-repository'
import { MockChangeEventRepository } from './mock/adapters/mock-change-repository'
import { MockProjectRepository } from './mock/adapters/mock-project-repository'
import { MockRuleConfigRepository } from './mock/adapters/mock-rule-config-repository'
import { MockVersionRepository } from './mock/adapters/mock-version-repository'

export const projectRepository: ProjectRepository = new MockProjectRepository()
export const alertRepository: AlertRepository = new MockAlertRepository()
export const activityRepository: ActivityRepository =
  new MockActivityRepository()
export const versionRepository: VersionRepository = new MockVersionRepository()
export const changeEventRepository: ChangeEventRepository =
  new MockChangeEventRepository()
export const ruleConfigRepository: RuleConfigRepository =
  new MockRuleConfigRepository()

export { resetDemoData } from './mock/storage/db'
export * from './contracts'
