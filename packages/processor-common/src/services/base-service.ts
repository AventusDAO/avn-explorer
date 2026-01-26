import { Store } from '@subsquid/typeorm-store'
import { formatError, isRetryableError } from '../utils/error-handling'
import { retryWithBackoff, RetryContext } from '../utils/retry'
import { RETRY_CONFIG } from '../utils/constants'
import { batchSave, batchInsert } from '../utils/database-ops'

export abstract class BaseService {
  constructor(protected store: Store, protected log?: any) {}

  protected handleAndThrow(error: unknown, context?: Record<string, any>): never {
    const message = formatError(error, context)
    this.log?.error(message)
    throw error instanceof Error ? error : new Error(String(error))
  }

  protected async handleErrorWithRetry<T>(
    fn: () => Promise<T>,
    context?: Record<string, any>
  ): Promise<T> {
    try {
      return await fn()
    } catch (error) {
      if (isRetryableError(error)) {
        return await retryWithBackoff(fn, RETRY_CONFIG.MAX_RETRIES, RETRY_CONFIG.BASE_DELAY_MS, {
          log: this.log,
          ...context
        } as RetryContext)
      }
      this.handleAndThrow(error, context)
    }
  }

  protected logInfo(message: string, context?: Record<string, any>): void {
    if (context) {
      this.log?.info(message, context)
    } else {
      this.log?.info(message)
    }
  }

  protected logDebug(message: string, context?: Record<string, any>): void {
    if (context) {
      this.log?.debug(message, context)
    } else {
      this.log?.debug(message)
    }
  }

  protected logWarn(message: string, context?: Record<string, any>): void {
    if (context) {
      this.log?.warn(message, context)
    } else {
      this.log?.warn(message)
    }
  }

  protected logError(message: string, context?: Record<string, any>): void {
    if (context) {
      this.log?.error(message, context)
    } else {
      this.log?.error(message)
    }
  }

  protected async saveBatch<T>(
    entities: T[],
    options: { batchSize?: number; entityName: string }
  ): Promise<void> {
    await batchSave(this.store, entities, {
      ...options,
      log: this.log
    })
  }

  protected async insertBatch<T>(
    entities: T[],
    options: { batchSize?: number; entityName: string }
  ): Promise<void> {
    await batchInsert(this.store, entities, {
      ...options,
      log: this.log
    })
  }
}
