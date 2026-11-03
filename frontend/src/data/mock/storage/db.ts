import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { ActivityLog, Alert, Project } from '@/domain/models'
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

interface ProyTrackDB extends DBSchema {
  projects: { key: string; value: Project }
  alerts: { key: string; value: Alert }
  activity: { key: string; value: ActivityLog }
  meta: { key: string; value: DatasetMeta }
}

let databasePromise: Promise<IDBPDatabase<ProyTrackDB>> | null = null

function writeDataset(
  db: IDBPDatabase<ProyTrackDB>,
  dataset: DemoDataset,
): Promise<void> {
  const tx = db.transaction(['projects', 'alerts', 'activity', 'meta'], 'readwrite')

  tx.objectStore('projects').clear()
  tx.objectStore('alerts').clear()
  tx.objectStore('activity').clear()

  for (const project of dataset.projects) {
    tx.objectStore('projects').put(project)
  }
  for (const alert of dataset.alerts) {
    tx.objectStore('alerts').put(alert)
  }
  for (const entry of dataset.activity) {
    tx.objectStore('activity').put(entry)
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

async function ensureSeeded(db: IDBPDatabase<ProyTrackDB>): Promise<void> {
  const meta = await db.get('meta', 'dataset')
  const isCurrent =
    meta !== undefined &&
    meta.seedVersion === DEMO_SEED_VERSION &&
    meta.schemaVersion === DEMO_SCHEMA_VERSION &&
    meta.referenceDate === DEMO_REFERENCE_DATE

  if (isCurrent) {
    const projectCount = await db.count('projects')
    if (projectCount > 0) return
  }

  await writeDataset(db, generateDemoDataset())
}

export function getDatabase(): Promise<IDBPDatabase<ProyTrackDB>> {
  if (!databasePromise) {
    databasePromise = openDB<ProyTrackDB>(
      DEMO_DATABASE_NAME,
      DEMO_SCHEMA_VERSION,
      {
        upgrade(db) {
          if (!db.objectStoreNames.contains('projects')) {
            db.createObjectStore('projects', { keyPath: 'id' })
          }
          if (!db.objectStoreNames.contains('alerts')) {
            db.createObjectStore('alerts', { keyPath: 'id' })
          }
          if (!db.objectStoreNames.contains('activity')) {
            db.createObjectStore('activity', { keyPath: 'id' })
          }
          if (!db.objectStoreNames.contains('meta')) {
            db.createObjectStore('meta')
          }
        },
      },
    ).then(async (db) => {
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
