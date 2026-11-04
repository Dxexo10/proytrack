import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type {
  ActivityLog,
  Alert,
  ChangeEvent,
  Project,
  ProjectVersion,
  RuleConfig,
} from '@/domain/models'
import {
  DEMO_DATABASE_NAME,
  DEMO_REFERENCE_DATE,
  DEMO_SCHEMA_VERSION,
  DEMO_SEED_VERSION,
} from '@/lib/demo-config'
import { generateDemoDataset, type DemoDataset } from '../seed/seed'

export interface DatasetMeta {
  seedVersion: number
  schemaVersion: number
  referenceDate: string
  seededAt: string
}

export interface TrazoDB extends DBSchema {
  projects: { key: string; value: Project }
  versions: { key: string; value: ProjectVersion }
  changes: { key: string; value: ChangeEvent }
  alerts: { key: string; value: Alert }
  activity: { key: string; value: ActivityLog }
  rules: { key: string; value: RuleConfig }
  meta: { key: string; value: DatasetMeta }
}

let databasePromise: Promise<IDBPDatabase<TrazoDB>> | null = null

function writeDataset(
  db: IDBPDatabase<TrazoDB>,
  dataset: DemoDataset,
): Promise<void> {
  const tx = db.transaction(
    ['projects', 'versions', 'changes', 'alerts', 'activity', 'rules', 'meta'],
    'readwrite',
  )

  tx.objectStore('projects').clear()
  tx.objectStore('versions').clear()
  tx.objectStore('changes').clear()
  tx.objectStore('alerts').clear()
  tx.objectStore('activity').clear()
  tx.objectStore('rules').clear()

  for (const project of dataset.projects) {
    tx.objectStore('projects').put(project)
  }
  for (const version of dataset.versions) {
    tx.objectStore('versions').put(version)
  }
  for (const change of dataset.changes) {
    tx.objectStore('changes').put(change)
  }
  for (const alert of dataset.alerts) {
    tx.objectStore('alerts').put(alert)
  }
  for (const entry of dataset.activity) {
    tx.objectStore('activity').put(entry)
  }
  for (const rule of dataset.rules) {
    tx.objectStore('rules').put(rule)
  }

  tx.objectStore('meta').put(
    {
      seedVersion: DEMO_SEED_VERSION,
      schemaVersion: DEMO_SCHEMA_VERSION,
      referenceDate: DEMO_REFERENCE_DATE,
      seededAt: new Date().toISOString(),
    },
    'dataset',
  )

  return tx.done
}

async function ensureSeeded(db: IDBPDatabase<TrazoDB>): Promise<void> {
  const meta = await db.get('meta', 'dataset')
  const isCurrent =
    meta !== undefined &&
    meta.seedVersion === DEMO_SEED_VERSION &&
    meta.schemaVersion === DEMO_SCHEMA_VERSION &&
    meta.referenceDate === DEMO_REFERENCE_DATE

  if (isCurrent) {
    const projectCount = await db.count('projects')
    const versionCount = await db.count('versions')
    if (projectCount > 0 && versionCount > 0) return
  }

  await writeDataset(db, generateDemoDataset())
}

export function getDatabase(): Promise<IDBPDatabase<TrazoDB>> {
  if (!databasePromise) {
    databasePromise = openDB<TrazoDB>(DEMO_DATABASE_NAME, DEMO_SCHEMA_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('projects')) {
          db.createObjectStore('projects', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('versions')) {
          db.createObjectStore('versions', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('changes')) {
          db.createObjectStore('changes', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('alerts')) {
          db.createObjectStore('alerts', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('activity')) {
          db.createObjectStore('activity', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('rules')) {
          db.createObjectStore('rules', { keyPath: 'id' })
        }
        if (!db.objectStoreNames.contains('meta')) {
          db.createObjectStore('meta')
        }
      },
    }).then(async (db) => {
      await ensureSeeded(db)
      return db
    })
  }

  return databasePromise
}

export async function resetDemoData(): Promise<void> {
  const db = await getDatabase()
  await writeDataset(db, generateDemoDataset())
}
