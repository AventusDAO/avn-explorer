import { Store } from '@subsquid/typeorm-store'
import { Alert } from '../model'
import { SubstrateBlock } from '@subsquid/substrate-processor'
import { MoreThan } from 'typeorm'
import { decodeId } from '@avn/utils'
import { ChainStorageService, IBalance } from './chain-storage.service'
import { ConfigService, BalanceConfig } from './config.service'
import { balanceWarningGauge, balanceErrorGauge } from '../prometheus-metrics'
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
    const blockTimestamp = new Date(block.timestamp)

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

    try {
      const accountResults = await processInParallel(
        balanceConfigs.map((config, i) => ({ config, balance: balances[i] })),
        async ({ config, balance }: { config: BalanceConfig; balance: IBalance }) => {
          return this.processAccount(config, balance, block, blockTimestamp, now, log)
        },
        {
          concurrency: CONCURRENCY_CONFIG.ITEM_PROCESSING,
          onError: (error: Error, { config }: { config: BalanceConfig }) => {
            if (log) {
              log.error(`Error processing account ${config.accountAddress}: ${error.message}`)
            }
          }
        }
      )

      for (const alert of accountResults) {
        if (alert !== null) {
          alerts.push(alert)
        }
      }

      return { alerts }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      const errorStack = error instanceof Error ? error.stack : undefined
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
    blockTimestamp: Date,
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
        true, // isError
        block,
        blockTimestamp,
        now,
        log
      )
    } else if (isWarning) {
      return await this.createBalanceAlert(
        config,
        totalBalance,
        config.warningThreshold,
        false, // isWarning
        block,
        blockTimestamp,
        now,
        log
      )
    } else {
      await this.clearBalanceAlerts(config, now)
    }

    return null
  }

  private async clearBalanceAlerts(config: BalanceConfig, now: Date): Promise<void> {
    const activeAlerts = await this.store.find(Alert, {
      where: {
        alertMessage: MoreThan(''),
        expireAt: MoreThan(now)
      }
    })

    const alertsToRemove = activeAlerts.filter(a =>
      a.alertMessage.includes(`account ${config.accountAddress}`)
    )

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
    isError: boolean,
    block: SubstrateBlock,
    blockTimestamp: Date,
    now: Date,
    log?: any
  ): Promise<Alert | null> {
    const alertType = isError ? 'danger' : 'warning'
    const alertMessage = `Balance ${alertType} for account ${
      config.accountAddress
    }: ${balance.toString()} < ${threshold}`

    const existingAlertsArray = await this.store.find(Alert, {
      where: {
        alertMessage: alertMessage,
        expireAt: MoreThan(now)
      }
    })
    const existingAlerts = existingAlertsArray

    if (existingAlerts.length > 0) {
      return null
    }

    const expireAt = new Date(now)
    expireAt.setHours(expireAt.getHours() + (isError ? 24 * 7 : 24))

    const alert = new Alert({
      id: `${config.accountAddress}-${alertType}-${block.height}-${Date.now()}`,
      alertMessage: alertMessage,
      isWarning: !isError,
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
