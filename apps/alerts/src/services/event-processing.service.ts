/**
 * Event processing service - handles blockchain event processing and alert creation
 */
import { Alert } from '../model'
import { SubstrateBlock } from '@subsquid/substrate-processor'
import { ConfigService, EventConfig } from './config.service'
import { collectBlockEvents, processBlockEvents, StandardErrorHandler } from '@avn/processor-common'

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
    this.maxAlertFrequency = parseInt(process.env.ALERTS_EVENT_ALERT_FREQUENCY || '1', 10)

    if (isNaN(this.maxAlertFrequency) || this.maxAlertFrequency < 1) {
      throw new Error(
        `Invalid ALERTS_EVENT_ALERT_FREQUENCY: ${process.env.ALERTS_EVENT_ALERT_FREQUENCY}. Must be a positive integer.`
      )
    }

    this.ttlMs = 60 * 60 * 1000

    this.startCleanupTimer()
  }

  private startCleanupTimer(): void {
    const cleanupIntervalMs = 10 * 60 * 1000 // 10 minutes
    this.cleanupInterval = setInterval(() => {
      this.cleanupExpiredEntries()
    }, cleanupIntervalMs)
  }

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
    }
  }

  destroy(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval)
      this.cleanupInterval = null
    }
  }

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

    const entry = this.eventAlertCounts.get(eventName)
    const now = Date.now()

    if (entry && now - entry.lastUpdated > this.ttlMs) {
      this.eventAlertCounts.delete(eventName)
    }

    const currentEntry = this.eventAlertCounts.get(eventName)
    const count = currentEntry?.count || 0

    if (count >= this.maxAlertFrequency) {
      return null
    }

    const alert = this.createEventAlert(eventName, block, config, item, eventIndex, log)

    if (alert) {
      this.eventAlertCounts.set(eventName, {
        count: count + 1,
        lastUpdated: now
      })
    }

    return alert
  }

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

  async processBlockEventsParallel(
    items: EventItem[],
    block: SubstrateBlock,
    concurrency: number = 10,
    log?: any,
    errorHandler?: StandardErrorHandler
  ): Promise<ProcessingResult> {
    const eventConfigs = this.configService.getEventConfigs()
    const configuredEventNames = eventConfigs.map(config => config.eventName)

    if (configuredEventNames.length === 0) {
      return { alerts: [] }
    }

    const collectedEvents = collectBlockEvents(
      { items, header: block } as any,
      configuredEventNames
    )

    if (collectedEvents.length === 0) {
      return { alerts: [] }
    }

    const alerts = await processBlockEvents(
      collectedEvents as any, // Type assertion needed due to generic type inference
      async (event: EventItem, index: number) => {
        const collectedEvent = collectedEvents[index]
        const eventIndex = collectedEvent?.index ?? index
        return this.processEventItem(event, block, eventIndex, log)
      },
      errorHandler ||
        ({
          handleEventError: (error: Error, blockHeight: number, eventName: string) => {
            if (log) {
              log.error(`Failed to process event ${eventName}`, {
                error: error.message,
                blockHeight
              })
            }
          }
        } as StandardErrorHandler),
      block.height,
      {
        concurrency,
        filterNulls: true
      }
    )

    return { alerts: alerts as Alert[] }
  }

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

    let alertMessage = `Event ${eventName} occurred at block ${block.height}`
    if (config.includeMetadata && item.event.extrinsic) {
      alertMessage += ` (extrinsic: ${item.event.extrinsic.hash})`
    }

    const expireAt = new Date(now)
    expireAt.setHours(expireAt.getHours() + 1)

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
          (this.eventAlertCounts.get(eventName) || 0) + 1
        }/${this.maxAlertFrequency})`
      )
    }

    return alert
  }

  getEventAlertCount(eventName: string): number {
    const entry = this.eventAlertCounts.get(eventName)
    if (!entry) {
      return 0
    }
    const now = Date.now()
    if (now - entry.lastUpdated > this.ttlMs) {
      this.eventAlertCounts.delete(eventName)
      return 0
    }
    return entry.count
  }

  resetAlertCounts(): void {
    this.eventAlertCounts.clear()
  }
}
