/**
 * Common processor initialization utilities
 * Standardizes service initialization, error handling, and logging across processors
 */
import { Store } from '@subsquid/typeorm-store'
import { ServiceManager } from '../services/service-manager'
import { formatError } from '../utils/error-handling'

/**
 * Logger interface for consistent logging across processors
 */
export interface ProcessorLogger {
  debug(message: string, context?: Record<string, any>): void
  info(message: string, context?: Record<string, any>): void
  warn(message: string, context?: Record<string, any>): void
  error(message: string, context?: Record<string, any>): void
  child?(name: string): ProcessorLogger
}

/**
 * Standardized error context for consistent error reporting
 */
export interface StandardErrorContext {
  blockHeight?: number
  eventName?: string
  serviceName?: string
  operation?: string
  [key: string]: any
}

/**
 * Standardized error handler
 * Provides consistent error formatting and logging across all processors
 */
export class StandardErrorHandler {
  constructor(private log: ProcessorLogger) {}

  /**
   * Handle and log an error with standardized format
   */
  handleError(
    error: unknown,
    context: StandardErrorContext = {},
    options: { rethrow?: boolean; logLevel?: 'error' | 'warn' } = {}
  ): void {
    const { rethrow = false, logLevel = 'error' } = options
    const errorMessage = error instanceof Error ? error.message : String(error)
    const errorStack = error instanceof Error ? error.stack : undefined

    // Build standardized error message
    const message = formatError(error, context)
    const logContext: Record<string, any> = {
      ...context,
      error: errorMessage,
      timestamp: new Date().toISOString()
    }

    if (errorStack) {
      logContext.stack = errorStack
    }

    // Log with appropriate level
    if (logLevel === 'warn') {
      this.log.warn(message, logContext)
    } else {
      this.log.error(message, logContext)
    }

    // Re-throw if requested
    if (rethrow) {
      throw error instanceof Error ? error : new Error(String(error))
    }
  }

  /**
   * Handle block processing error
   */
  handleBlockError(error: unknown, blockHeight: number, operation?: string): void {
    this.handleError(error, {
      blockHeight,
      operation: operation || 'block processing',
      serviceName: 'processor'
    })
  }

  /**
   * Handle event processing error
   */
  handleEventError(
    error: unknown,
    blockHeight: number,
    eventName: string,
    operation?: string
  ): void {
    this.handleError(error, {
      blockHeight,
      eventName,
      operation: operation || 'event processing',
      serviceName: 'processor'
    })
  }
}

/**
 * Standardized logger wrapper
 * Provides consistent logging format across all processors
 */
export class StandardLogger implements ProcessorLogger {
  constructor(private baseLog: any, private context: string = 'processor') {}

  debug(message: string, context?: Record<string, any>): void {
    if (context) {
      this.baseLog.debug(message, context)
    } else {
      this.baseLog.debug(message)
    }
  }

  info(message: string, context?: Record<string, any>): void {
    if (context) {
      this.baseLog.info(message, context)
    } else {
      this.baseLog.info(message)
    }
  }

  warn(message: string, context?: Record<string, any>): void {
    if (context) {
      this.baseLog.warn(message, context)
    } else {
      this.baseLog.warn(message)
    }
  }

  error(message: string, context?: Record<string, any>): void {
    if (context) {
      this.baseLog.error(message, context)
    } else {
      this.baseLog.error(message)
    }
  }

  child(name: string): ProcessorLogger {
    // If base log supports child, use it; otherwise create new logger with context
    if (typeof this.baseLog.child === 'function') {
      return new StandardLogger(this.baseLog.child(name), `${this.context}.${name}`)
    }
    return new StandardLogger(this.baseLog, `${this.context}.${name}`)
  }
}

/**
 * Processor initialization context
 * Standardizes service initialization across all processors
 */
export interface ProcessorInitContext {
  store: Store
  log: ProcessorLogger
  serviceManager: ServiceManager
}

// Module-level singleton ServiceManager to persist across batches
let globalServiceManager: ServiceManager | null = null
let globalLogger: StandardLogger | null = null
let globalErrorHandler: StandardErrorHandler | null = null

/**
 * Initialize processor services with standardized pattern
 * ServiceManager is a true singleton that persists across batches
 */
export function initializeProcessorServices<T extends Record<string, any>>(
  store: Store,
  log: any,
  serviceFactory: (context: ProcessorInitContext) => T
): T & {
  serviceManager: ServiceManager
  errorHandler: StandardErrorHandler
  logger: StandardLogger
} {
  // Create standardized logger (singleton)
  if (!globalLogger) {
    globalLogger = new StandardLogger(log)
  }
  const logger = globalLogger

  // Create service manager (true singleton - persists across batches)
  if (!globalServiceManager) {
    globalServiceManager = new ServiceManager(store, logger)
  }
  const serviceManager = globalServiceManager

  // Create error handler (singleton)
  if (!globalErrorHandler) {
    globalErrorHandler = new StandardErrorHandler(logger)
  }
  const errorHandler = globalErrorHandler

  // Create initialization context
  const initContext: ProcessorInitContext = {
    store,
    log: logger,
    serviceManager
  }

  // Initialize services using factory
  const services = serviceFactory(initContext)

  return {
    ...services,
    serviceManager,
    errorHandler,
    logger
  }
}
