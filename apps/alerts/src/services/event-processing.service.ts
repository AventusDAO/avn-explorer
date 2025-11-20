/**
 * Event processing service - handles blockchain event processing and alert creation
 */
import { Alert } from '../model'
import { SubstrateBlock } from '@subsquid/substrate-processor'
import { ConfigService, EventConfig } from './config.service'
import {
  collectBlockEvents,
  processBlockEvents,
  StandardErrorHandler
} from '@avn/processor-common'

export interface EventItem {
  kind: string
  name: string
  event: {
    id?: string
    args: any
    extrinsic?: {
      id: string
      hash: string
    }
  }
}

export interface ProcessingResult {
  alerts: Alert[]
}

interface EventAlertCountEntry {
  count: number
  lastUpdated: number
}

export class EventProcessingService {
  private eventAlertCounts = new Map<string, EventAlertCountEntry>()
  private readonly maxAlertFrequency: number
  private readonly ttlMs: number
  private cleanupInterval: NodeJS.Timeout | null = null

  constructor(private configService: ConfigService) {
    // Read from env var, default to 1
    // ALERTS_EVENT_ALERT_FREQUENCY controls how many times an alert should be emitted for the same event
    this.maxAlertFrequency = parseInt(process.env.ALERTS_EVENT_ALERT_FREQUENCY || '1', 10)

    if (isNaN(this.maxAlertFrequency) || this.maxAlertFrequency < 1) {
      throw new Error(
        `Invalid ALERTS_EVENT_ALERT_FREQUENCY: ${process.env.ALERTS_EVENT_ALERT_FREQUENCY}. Must be a positive integer.`
      )
    }

    // TTL for event alert counts: 1 hour (same as alert expiration)
    // This prevents unbounded memory growth
    this.ttlMs = 60 * 60 * 1000

    // Periodic cleanup every 10 minutes
    this.startCleanupTimer()
  }

  /**
   * Start periodic cleanup timer for expired entries
   */
  private startCleanupTimer(): void {
    const cleanupIntervalMs = 10 * 60 * 1000 // 10 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpiredEntries()
    }, cleanupIntervalMs)
  }

  /**
   * Clean up expired entries from eventAlertCounts
   */
  private cleanupExpiredEntries(): void {
    const now = Date.now()
    const expiredKeys: string[] = []

    for (const [eventName, entry] of this.eventAlertCounts.entries()) {
      if (now - entry.lastUpdated > this.ttlMs) {
        expiredKeys.push(eventName)
      }
    }

    for (const key of expiredKeys) {
      this.eventAlertCounts.delete(key)
    }

    if (expiredKeys.length > 0) {
      // Log cleanup if needed (optional)
    }
  }

  /**
   * Cleanup on service destruction
   */
  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
  }

  /**
   * Process a single event item and create alert if needed
   */
  processEventItem(
    item: EventItem,
    block: SubstrateBlock,
    eventIndex: number,
    log?: any
  ): Alert | null {
    if (item.kind !== 'event') return null

    const eventName = item.name
    const config = this.configService.getEventConfig(eventName)
    if (!config) return null

    // Check frequency limit with TTL
    const entry = this.eventAlertCounts.get(eventName)
    const now = Date.now()

    // Remove expired entries
    if (entry && now - entry.lastUpdated > this.ttlMs) {
      this.eventAlertCounts.delete(eventName)
    }

    const currentEntry = this.eventAlertCounts.get(eventName)
    const count = currentEntry?.count || 0

    if (count >= this.maxAlertFrequency) {
      // Already reached frequency limit, skip alert creation
      // Note: EventProcessingService doesn't extend BaseService because it doesn't use Store
      // Logging is handled via the log parameter passed from processor
      return null
    }

    // Create alert
    const alert = this.createEventAlert(eventName, block, config, item, eventIndex, log)

    if (alert) {
      // Update counter with timestamp
      this.eventAlertCounts.set(eventName, {
        count: count + 1,
        lastUpdated: now
      })
    }

    return alert
  }

  /**
   * Process all events in a block (sequentially)
   */
  processBlockEvents(items: EventItem[], block: SubstrateBlock, log?: any): ProcessingResult {
    const alerts: Alert[] = []
    let eventIndex = 0

    for (const item of items) {
      if (item.kind === 'event') {
        const alert = this.processEventItem(item, block, eventIndex, log)
        if (alert) {
          alerts.push(alert)
        }
        eventIndex++
      }
    }

    return { alerts }
  }

  /**
   * Process all events in a block in parallel using standardized processBlockEvents
   */
  async processBlockEventsParallel(
    items: EventItem[],
    block: SubstrateBlock,
    concurrency: number = 10,
    log?: any,
    errorHandler?: StandardErrorHandler
  ): Promise<ProcessingResult> {
    // Get configured event names to filter
    const eventConfigs = this.configService.getEventConfigs()
    const configuredEventNames = eventConfigs.map(config => config.eventName)

    if (configuredEventNames.length === 0) {
      return { alerts: [] }
    }

    // Collect events using standardized utility
    const collectedEvents = collectBlockEvents(
      { items, header: block } as any,
      configuredEventNames
    )

    if (collectedEvents.length === 0) {
      return { alerts: [] }
    }

    // Process events using standardized processBlockEvents utility
    // Note: We need to track event index for alert creation, so we use the index from collectedEvents
    const alerts = await processBlockEvents(
      collectedEvents as any, // Type assertion needed due to generic type inference
      async (event: EventItem, index: number) => {
        // Use the index from the collected event for proper alert ID generation
        const collectedEvent = collectedEvents[index]
        const eventIndex = collectedEvent?.index ?? index
        return this.processEventItem(event, block, eventIndex, log)
      },
      errorHandler || {
        handleEventError: (error: Error, blockHeight: number, eventName: string) => {
          if (log) {
            log.error(`Failed to process event ${eventName}`, {
              error: error.message,
              blockHeight
            })
          }
        }
      } as StandardErrorHandler,
      block.height,
      {
        concurrency,
        filterNulls: true
      }
    )

    return { alerts: alerts as Alert[] }
  }

  /**
   * Create an alert for an event occurrence
   */
  private createEventAlert(
    eventName: string,
    block: SubstrateBlock,
    config: EventConfig,
    item: EventItem,
    eventIndex: number,
    log?: any
  ): Alert {
    const now = new Date()
    const blockTimestamp = new Date(block.timestamp)
    const [section, method] = eventName.split('.')

    // Build alert message
    let alertMessage = `Event ${eventName} occurred at block ${block.height}`
    if (config.includeMetadata && item.event.extrinsic) {
      alertMessage += ` (extrinsic: ${item.event.extrinsic.hash})`
    }

    // Calculate expiration time: 1 hour for event alerts
    const expireAt = new Date(now)
    expireAt.setHours(expireAt.getHours() + 1)

    // Create alert ID
    const eventId = item.event.id || `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`
    const alertId = `event-${eventName}-${block.height}-${eventIndex}-${eventId}`

    const alert = new Alert({
      id: alertId,
      alertMessage: alertMessage,
      isWarning: true, // Events are warnings, not errors
      isError: false,
      expireAt: expireAt,
      createdAt: now
    })

    if (log) {
      log.info(
        `Event: ${eventName} at block ${block.height} (alert ${
          this.eventAlertCounts.get(eventName) || 0 + 1
        }/${this.maxAlertFrequency})`
      )
    }

    return alert
  }

  /**
   * Get current alert count for an event (for testing/debugging)
   */
  getEventAlertCount(eventName: string): number {
    const entry = this.eventAlertCounts.get(eventName)
    if (!entry) {
      return 0
    }
    // Check if expired
    const now = Date.now()
    if (now - entry.lastUpdated > this.ttlMs) {
      this.eventAlertCounts.delete(eventName)
      return 0
    }
    return entry.count
  }

  /**
   * Reset alert counts (for testing/debugging)
   */
  resetAlertCounts(): void {
    this.eventAlertCounts.clear()
  }
}
