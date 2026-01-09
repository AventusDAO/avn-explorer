export {
  processInParallel,
  getDefaultConcurrency,
  type ConcurrencyOptions
} from './utils/concurrency'

export { retryWithBackoff, type RetryContext } from './utils/retry'

export { CONCURRENCY_CONFIG, RETRY_CONFIG } from './utils/constants'

export {
  validateSS58Address,
  validateBigIntString,
  validatePrometheusTags,
  validateEventName
} from './utils/validation'

export { formatError, isRetryableError, type ErrorContext } from './utils/error-handling'

export {
  collectEvents,
  collectCalls,
  filterItems,
  isEvent,
  isCall,
  matchesAnyName,
  type ProcessableItem,
  type CollectedEvent
} from './utils/event-collection'

export {
  batchSave,
  batchInsert
} from './utils/database-ops'

export { BaseService } from './services/base-service'

export { ServiceManager } from './services/service-manager'

export {
  collectBlockEvents,
  processBlockEvents
} from './processors/block-processor'

export { ResultAggregator } from './processors/result-aggregator'

export {
  initializeProcessorServices,
  StandardErrorHandler,
  StandardLogger,
  type ProcessorLogger,
  type StandardErrorContext,
  type ProcessorInitContext
} from './processors/processor-initializer'
