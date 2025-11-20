/**
 * Configuration service - manages loading and caching of configuration
 * Config is static throughout runtime, loaded from file at startup
 */
import { loadConfigFromFile } from './config/config-loader'
import { validateConfig } from './config/config-validator'
import {
  BalanceConfig,
  EventConfig,
  QueueConfig,
  ConfigData
} from './config/types'

export type { BalanceConfig, EventConfig, QueueConfig, ConfigData } from './config/types'

export class ConfigService {
  private balanceConfigs: BalanceConfig[] = []
  private eventConfigs: EventConfig[] = []
  private eventConfigsMap: Map<string, EventConfig> = new Map()
  private queueConfigs: QueueConfig[] = []
  private queueConfigsMap: Map<string, QueueConfig> = new Map()

  /**
   * Load configuration from JSON file (called once at startup)
   * Config is static throughout runtime
   */
  loadFromFile(log?: any): void {
    const config = loadConfigFromFile()
    validateConfig(config)

    // Store in memory (no database)
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

    // Load queue configs (optional)
    this.queueConfigs = (config.queues || []).map(qc => ({
      queueName: qc.queueName,
      prometheusTags: qc.prometheusTags,
      warningThreshold: qc.warningThreshold,
      errorThreshold: qc.errorThreshold
    }))

    // Build event configs map for fast lookup
    this.eventConfigsMap.clear()
    this.eventConfigs.forEach(config => {
      this.eventConfigsMap.set(config.eventName, config)
    })

    // Build queue configs map for fast lookup
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

  /**
   * Get balance configurations
   */
  getBalanceConfigs(): BalanceConfig[] {
    return this.balanceConfigs
  }

  /**
   * Get event configurations
   */
  getEventConfigs(): EventConfig[] {
    return this.eventConfigs
  }

  /**
   * Get event config by name
   */
  getEventConfig(eventName: string): EventConfig | undefined {
    return this.eventConfigsMap.get(eventName)
  }

  /**
   * Get queue configurations
   */
  getQueueConfigs(): QueueConfig[] {
    return this.queueConfigs
  }

  /**
   * Get queue config by name
   */
  getQueueConfig(queueName: string): QueueConfig | undefined {
    return this.queueConfigsMap.get(queueName)
  }

  /**
   * Check if config is loaded
   */
  isConfigLoaded(): boolean {
    return (
      this.balanceConfigs.length > 0 || this.eventConfigs.length > 0 || this.queueConfigs.length > 0
    )
  }
}
