/**
 * Database operation utilities for batching and optimization
 */
import { Store } from '@subsquid/typeorm-store'

/**
 * Batch save configuration
 */
export interface BatchSaveOptions {
  batchSize?: number
  log?: any
  entityName: string
}

/**
 * Batch save entities to database
 * Optimizes database operations by batching saves
 */
export async function batchSave<T>(
  store: Store,
  entities: T[],
  options: BatchSaveOptions
): Promise<void> {
  const { batchSize = 1000, log, entityName } = options

  if (entities.length === 0) {
    return
  }

  // Process in batches
  for (let i = 0; i < entities.length; i += batchSize) {
    const batch = entities.slice(i, i + batchSize)
    await store.save(batch as any)

    if (log) {
      log.debug(`Saved batch ${Math.floor(i / batchSize) + 1}: ${batch.length} ${entityName}`)
    }
  }

  if (log) {
    log.info(`Saved ${entities.length} ${entityName} in batches of ${batchSize}`)
  }
}

export async function batchInsert<T>(
  store: Store,
  entities: T[],
  options: BatchSaveOptions
): Promise<void> {
  const { batchSize = 1000, log, entityName } = options

  if (entities.length === 0) {
    return
  }

  // Process in batches
  for (let i = 0; i < entities.length; i += batchSize) {
    const batch = entities.slice(i, i + batchSize)
    await store.insert(batch as any)

    if (log) {
      log.debug(`Inserted batch ${Math.floor(i / batchSize) + 1}: ${batch.length} ${entityName}`)
    }
  }

  if (log) {
    log.info(`Inserted ${entities.length} ${entityName} in batches of ${batchSize}`)
  }
}

