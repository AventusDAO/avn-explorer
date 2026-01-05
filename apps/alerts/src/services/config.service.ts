/**
 * Configuration service - manages loading and caching of configuration
 * Config is static throughout runtime, loaded from file at startup
 */
import { loadConfigFromFile } from './config/config-loader'
import { validateConfig } from './config/config-validator'
import { BalanceConfig, EventConfig, QueueConfig, ConfigData } from './config/types'

export type { BalanceConfig, EventConfig, QueueConfig, ConfigData } from './config/types'

export class ConfigService {
  private balanceConfigs: BalanceConfig[] = []
  private eventConfigs: EventConfig[] = []
  private eventConfigsMap: Map<string, EventConfig> = new Map()
  private queueConfigs: QueueConfig[] = []
  private queueConfigsMap: Map<string, QueueConfig> = new Map()

  loadFromFile(log?: any): void {
    const config = loadConfigFromFile()
    validateConfig(config)

    this.balanceConfigs = config.balances.map(bc => ({
      accountAddress: bc.accountAddress,
      prometheusTags: bc.prometheusTags,
      warningThreshold: bc.warningThreshold,
      dangerThreshold: bc.dangerThreshold
    }))

    this.eventConfigs = config.events.map(ec => ({
      eventName: ec.eventName,
      prometheusTags: ec.prometheusTags,
      includeMetadata: ec.includeMetadata
    }))

    this.queueConfigs = (config.queues || []).map(qc => ({
      queueName: qc.queueName,
      prometheusTags: qc.prometheusTags,
      warningThreshold: qc.warningThreshold,
      errorThreshold: qc.errorThreshold
    }))

    this.eventConfigsMap.clear()
    this.eventConfigs.forEach(config => {
      this.eventConfigsMap.set(config.eventName, config)
    })

    this.queueConfigsMap.clear()
    this.queueConfigs.forEach(config => {
      this.queueConfigsMap.set(config.queueName, config)
    })

    if (log) {
      log.info(
        `Loaded ${this.balanceConfigs.length} balance configs, ${this.eventConfigs.length} event configs, and ${this.queueConfigs.length} queue configs from file`
      )
    }
  }

  getBalanceConfigs(): BalanceConfig[] {
    return this.balanceConfigs
  }

  getEventConfigs(): EventConfig[] {
    return this.eventConfigs
  }

  getEventConfig(eventName: string): EventConfig | undefined {
    return this.eventConfigsMap.get(eventName)
  }

  getQueueConfigs(): QueueConfig[] {
    return this.queueConfigs
  }

  getQueueConfig(queueName: string): QueueConfig | undefined {
    return this.queueConfigsMap.get(queueName)
  }

  isConfigLoaded(): boolean {
    return (
      this.balanceConfigs.length > 0 || this.eventConfigs.length > 0 || this.queueConfigs.length > 0
    )
  }
}
