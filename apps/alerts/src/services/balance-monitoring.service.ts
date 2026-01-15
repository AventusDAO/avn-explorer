import { Store } from '@subsquid/typeorm-store'
import { Alert } from '../model'
import { SubstrateBlock } from '@subsquid/substrate-processor'
import { MoreThan } from 'typeorm'
import { decodeId } from '@avn/utils'
import { ChainStorageService, IBalance } from './chain-storage.service'
import { ConfigService, BalanceConfig, AlertSeverity } from './config.service'
import { balanceWarningGauge, balanceErrorGauge } from '../prometheus-metrics'
import { ALERT_EXPIRATION_HOURS } from '../utils/constants'
import {
  retryWithBackoff,
  RetryContext,
  RETRY_CONFIG,
  processInParallel,
  CONCURRENCY_CONFIG,
  BaseService
} from '@avn/processor-common'

export interface ProcessingResult {
  alerts: Alert[]
}

export class BalanceMonitoringService extends BaseService {
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
    const balanceConfigs = this.configService.getBalanceConfigs()

    if (balanceConfigs.length === 0) {
      return { alerts: [] }
    }

    const alerts: Alert[] = []
    const now = new Date()

    const accountsU8 = balanceConfigs.map(config => decodeId(config.accountAddress))

    const balances = await retryWithBackoff(
      async () => {
        const result = await this.chainStorageService.getBalances(ctx, block as any, accountsU8)
        if (!result && log) {
          log.warn(`No balances found for block ${block.height}`)
        }
        return result
      },
      RETRY_CONFIG.MAX_RETRIES,
      RETRY_CONFIG.BASE_DELAY_MS,
      { log, blockHeight: block.height } as RetryContext
    )

    if (!balances) {
      return { alerts: [] }
    }

    const processBalanceItem = async ({
      config,
      balance
    }: {
      config: BalanceConfig
      balance: IBalance
    }): Promise<Alert | null> => {
      return this.processAccount(config, balance, block, now, log)
    }

    const handleBalanceError = (error: Error, { config }: { config: BalanceConfig }): void => {
      if (log) {
        log.error(`Error processing account ${config.accountAddress}: ${error.message}`)
      }
    }

    try {
      const accountResults = await processInParallel(
        balanceConfigs.map((config, i) => ({ config, balance: balances[i] })),
        processBalanceItem,
        {
          concurrency: CONCURRENCY_CONFIG.ITEM_PROCESSING,
          onError: handleBalanceError
        }
      )

      for (const alert of accountResults) {
        if (alert !== null) {
          alerts.push(alert)
        }
      }

      return { alerts }
    } catch (error) {
      const isError = error instanceof Error
      const errorMessage = isError ? error.message : String(error)
      const errorStack = isError ? error.stack : undefined
      if (log) {
        log.error(`Failed to check balances for block ${block.height}`, {
          blockHeight: block.height,
          accountCount: balanceConfigs.length,
          error: errorMessage,
          stack: errorStack
        })
      }
      throw error
    }
  }

  private async processAccount(
    config: BalanceConfig,
    balance: IBalance | null | undefined,
    block: SubstrateBlock,
    now: Date,
    log?: any
  ): Promise<Alert | null> {
    if (!balance) {
      return null
    }

    const totalBalance = balance.free + balance.reserved
    const warningThreshold = BigInt(config.warningThreshold)
    const dangerThreshold = BigInt(config.dangerThreshold)

    const isDanger = totalBalance <= dangerThreshold
    const isWarning = totalBalance <= warningThreshold && !isDanger

    if (isDanger) {
      return await this.createBalanceAlert(
        config,
        totalBalance,
        config.dangerThreshold,
        'error',
        block,
        now,
        log
      )
    } else if (isWarning) {
      return await this.createBalanceAlert(
        config,
        totalBalance,
        config.warningThreshold,
        'warning',
        block,
        now,
        log
      )
    } else {
      await this.clearBalanceAlerts(config, now)
    }

    return null
  }

  private async clearBalanceAlerts(config: BalanceConfig, now: Date): Promise<void> {
    const alertsToRemove = await this.store.find(Alert, {
      where: {
        alertType: 'balance',
        sourceIdentifier: config.accountAddress,
        expireAt: MoreThan(now)
      }
    })

    if (alertsToRemove.length > 0) {
      await this.store.remove(alertsToRemove)
      balanceWarningGauge.set({ account: config.accountAddress }, 0)
      balanceErrorGauge.set({ account: config.accountAddress }, 0)
    }
  }

  private async createBalanceAlert(
    config: BalanceConfig,
    balance: bigint,
    threshold: string,
    severity: AlertSeverity,
    block: SubstrateBlock,
    now: Date,
    log?: any
  ): Promise<Alert | null> {
    const isError = severity === 'error'
    const severityLabel = isError ? 'danger' : 'warning'
    const alertMessage = `Balance ${severityLabel} for account ${
      config.accountAddress
    }: ${balance.toString()} < ${threshold}`

    const existingAlerts = await this.store.find(Alert, {
      where: {
        alertType: 'balance',
        sourceIdentifier: config.accountAddress,
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
      id: `${config.accountAddress}-${severityLabel}-${block.height}-${Date.now()}`,
      alertType: 'balance',
      sourceIdentifier: config.accountAddress,
      alertMessage: alertMessage,
      isWarning: severity === 'warning',
      isError: isError,
      expireAt: expireAt,
      createdAt: now
    })

    if (isError) {
      this.logError(
        `🚨 DANGER: Account ${
          config.accountAddress
        } balance ${balance.toString()} <= ${threshold}. Tags: ${config.prometheusTags}`
      )
    } else {
      this.logWarn(
        `⚠️ WARNING: Account ${
          config.accountAddress
        } balance ${balance.toString()} <= ${threshold}. Tags: ${config.prometheusTags}`
      )
    }

    return alert
  }
}
