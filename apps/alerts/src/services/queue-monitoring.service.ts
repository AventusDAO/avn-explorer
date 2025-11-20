/**
 * Queue monitoring service - handles queue count checking and alert creation
 */
import { Store } from '@subsquid/typeorm-store'
import { Alert } from '../model'
import { SubstrateBlock } from '@subsquid/substrate-processor'
import { MoreThan } from 'typeorm'
import { ChainStorageService } from './chain-storage.service'
import { ConfigService, QueueConfig } from './config.service'
import {
  retryWithBackoff,
  RetryContext,
  RETRY_CONFIG,
  BaseService
} from '@avn/processor-common'

export interface ProcessingResult {
  alerts: Alert[]
}

export class QueueMonitoringService extends BaseService {
  constructor(
    store: Store,
    log: any,
    private configService: ConfigService,
    private chainStorageService: ChainStorageService
  ) {
    super(store, log)
  }

  /**
   * Process a block and create queue alerts
   */
  async processBlock(
    ctx: any, // ChainContext
    block: SubstrateBlock,
    log?: any
  ): Promise<ProcessingResult> {
    const queueConfigs = this.configService.getQueueConfigs()

    if (queueConfigs.length === 0) {
      return { alerts: [] }
    }

    const alerts: Alert[] = []
    const now = new Date()
    const blockTimestamp = new Date(block.timestamp)

    // Process each queue config
    for (const config of queueConfigs) {
      try {
        // Parse queue name (format: "section.storageName")
        const [section, storageName] = config.queueName.split('.')
        if (!section || !storageName) {
          this.logWarn(
            `Invalid queue name format: ${config.queueName}. Expected format: "section.storageName"`
          )
          continue
        }

        // Get queue count from storage
        const queueCount = await retryWithBackoff(
          async () => {
            return await this.chainStorageService.getQueueCount(
              ctx,
              block as any,
              section,
              storageName
            )
          },
          RETRY_CONFIG.MAX_RETRIES,
          RETRY_CONFIG.BASE_DELAY_MS,
          { log, blockHeight: block.height } as RetryContext
        )

        if (queueCount === undefined) {
          continue
        }

        // Check thresholds and create alert if needed
        const warningThreshold = parseInt(config.warningThreshold, 10)
        const errorThreshold = parseInt(config.errorThreshold, 10)

        const isWarning = queueCount >= warningThreshold && queueCount < errorThreshold
        const isError = queueCount >= errorThreshold

        if (isError) {
          const alert = await this.createQueueAlert(
            config,
            queueCount,
            errorThreshold,
            true, // isError
            block,
            blockTimestamp,
            now
          )
          if (alert) {
            alerts.push(alert)
          }
        } else if (isWarning) {
          const alert = await this.createQueueAlert(
            config,
            queueCount,
            warningThreshold,
            false, // isWarning
            block,
            blockTimestamp,
            now
          )
          if (alert) {
            alerts.push(alert)
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        this.logError(
          `Failed to check queue ${config.queueName} for block ${block.height}: ${errorMessage}`
        )
        // Continue processing other queues
      }
    }

    return { alerts }
  }

  /**
   * Create a queue alert if one doesn't already exist (deduplication)
   */
  private async createQueueAlert(
    config: QueueConfig,
    queueCount: number,
    threshold: number,
    isError: boolean,
    block: SubstrateBlock,
    blockTimestamp: Date,
    now: Date
  ): Promise<Alert | null> {
    const alertType = isError ? 'error' : 'warning'
    const alertMessage = `Queue ${alertType} for ${config.queueName}: ${queueCount} >= ${threshold}`

    // Check for existing non-expired alert with same message
    const existingAlerts = await this.store.find(Alert, {
      where: {
        alertMessage: alertMessage,
        expireAt: MoreThan(now)
      }
    })

    if (existingAlerts.length > 0) {
      // Alert already exists and hasn't expired, skip creation
      return null
    }

    // Calculate expiration time: 7 days for errors, 1 day for warnings
    const expireAt = new Date(now)
    expireAt.setHours(expireAt.getHours() + (isError ? 24 * 7 : 24))

    // Create new alert
    const alert = new Alert({
      id: `${config.queueName}-${alertType}-${block.height}-${Date.now()}`,
      alertMessage: alertMessage,
      isWarning: !isError,
      isError: isError,
      expireAt: expireAt,
      createdAt: now
    })

    if (isError) {
      this.logError(
        `🚨 ERROR: Queue ${config.queueName} count ${queueCount} >= ${threshold}. Tags: ${config.prometheusTags}`
      )
    } else {
      this.logWarn(
        `⚠️ WARNING: Queue ${config.queueName} count ${queueCount} >= ${threshold}. Tags: ${config.prometheusTags}`
      )
    }

    return alert
  }
}
