/**
 * Queue monitoring service - handles queue count checking and alert creation
 */
import { Store } from '@subsquid/typeorm-store'
import { Alert } from '../model'
import { SubstrateBlock } from '@subsquid/substrate-processor'
import { MoreThan } from 'typeorm'
import { ChainStorageService } from './chain-storage.service'
import { ConfigService, QueueConfig, AlertSeverity } from './config.service'
import { retryWithBackoff, RetryContext, RETRY_CONFIG, BaseService } from '@avn/processor-common'
import { queueWarningGauge, queueErrorGauge } from '../prometheus-metrics'
import { ALERT_EXPIRATION_HOURS } from '../utils/constants'

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

    for (const config of queueConfigs) {
      try {
        const [section, storageName] = config.queueName.split('.')
        if (!section || !storageName) {
          this.logWarn(
            `Invalid queue name format: ${config.queueName}. Expected format: "section.storageName"`
          )
          continue
        }

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

        const warningThreshold = parseInt(config.warningThreshold, 10)
        const errorThreshold = parseInt(config.errorThreshold, 10)

        const isWarning = queueCount >= warningThreshold && queueCount < errorThreshold
        const isError = queueCount >= errorThreshold

        if (isError) {
          const alert = await this.createQueueAlert(
            config,
            queueCount,
            errorThreshold,
            'error',
            block,
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
            'warning',
            block,
            now
          )
          if (alert) {
            alerts.push(alert)
          }
        } else {
          // Healthy - clear any existing alerts for this queue
          await this.clearQueueAlerts(config, now)
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        this.logError(
          `Failed to check queue ${config.queueName} for block ${block.height}: ${errorMessage}`
        )
      }
    }

    return { alerts }
  }

  private async clearQueueAlerts(config: QueueConfig, now: Date): Promise<void> {
    const alertsToRemove = await this.store.find(Alert, {
      where: {
        alertType: 'queue',
        sourceIdentifier: config.queueName,
        expireAt: MoreThan(now)
      }
    })

    if (alertsToRemove.length > 0) {
      await this.store.remove(alertsToRemove)
      queueWarningGauge.set({ queue: config.queueName }, 0)
      queueErrorGauge.set({ queue: config.queueName }, 0)
    }
  }

  private async createQueueAlert(
    config: QueueConfig,
    queueCount: number,
    threshold: number,
    severity: AlertSeverity,
    block: SubstrateBlock,
    now: Date
  ): Promise<Alert | null> {
    const isError = severity === 'error'
    const severityLabel = isError ? 'error' : 'warning'
    const alertMessage = `Queue ${severityLabel} for ${config.queueName}: ${queueCount} >= ${threshold}`

    // When escalating to error, clear any existing warning alerts
    if (isError) {
      const warningAlerts = await this.store.find(Alert, {
        where: {
          alertType: 'queue',
          sourceIdentifier: config.queueName,
          isWarning: true,
          expireAt: MoreThan(now)
        }
      })
      if (warningAlerts.length > 0) {
        await this.store.remove(warningAlerts)
        queueWarningGauge.set({ queue: config.queueName }, 0)
      }
    }

    const existingAlerts = await this.store.find(Alert, {
      where: {
        alertType: 'queue',
        sourceIdentifier: config.queueName,
        isError: isError,
        expireAt: MoreThan(now)
      }
    })

    if (existingAlerts.length > 0) {
      return null
    }

    const expirationHours = isError ? ALERT_EXPIRATION_HOURS.ERROR : ALERT_EXPIRATION_HOURS.WARNING
    const expireAt = new Date(now)
    expireAt.setHours(expireAt.getHours() + expirationHours)

    const alert = new Alert({
      id: `${config.queueName}-${severityLabel}-${block.height}-${Date.now()}`,
      alertType: 'queue',
      sourceIdentifier: config.queueName,
      alertMessage: alertMessage,
      isWarning: severity === 'warning',
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
