import { Store } from '@subsquid/typeorm-store'
import { Alert } from '../model'
import {
  updatePrometheusMetricsIncremental,
  updatePrometheusMetricsFull
} from '../prometheus-metrics'

export interface MetricsUpdateOptions {
  fullUpdateInterval?: number
}

export class MetricsUpdater {
  private blockCount = 0
  private readonly fullUpdateInterval: number

  constructor(options: MetricsUpdateOptions = {}) {
    this.fullUpdateInterval = options.fullUpdateInterval ?? 100
  }

  async updateMetrics(store: Store, newAlerts: Alert[], log?: any): Promise<void> {
    this.blockCount++

    const shouldDoFullUpdate = this.blockCount % this.fullUpdateInterval === 0
    const logger = this.createLogger(log)

    try {
      const hasEventAlerts = newAlerts.some(alert => alert.alertType === 'event')

      if (shouldDoFullUpdate || hasEventAlerts) {
        await updatePrometheusMetricsFull(store)
        const reason = shouldDoFullUpdate
          ? `block count: ${this.blockCount}, interval: ${this.fullUpdateInterval}`
          : 'event alerts detected for accurate counts'
        logger.debug(`Full metrics update (${reason})`)
      } else if (newAlerts.length > 0) {
        await updatePrometheusMetricsIncremental(store, newAlerts)
        logger.debug(`Incremental metrics update with ${newAlerts.length} new alerts`)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      logger.warn(`Failed to update metrics: ${errorMessage}`)
    }
  }

  async forceFullUpdate(store: Store, log?: any): Promise<void> {
    const logger = this.createLogger(log)
    try {
      await updatePrometheusMetricsFull(store)
      logger.debug('Forced full metrics update')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      logger.warn(`Failed to force full metrics update: ${errorMessage}`)
    }
  }

  private createLogger(log?: any) {
    const noop = () => {}
    return {
      debug: log?.debug?.bind(log) ?? noop,
      info: log?.info?.bind(log) ?? noop,
      warn: log?.warn?.bind(log) ?? noop,
      error: log?.error?.bind(log) ?? noop
    }
  }

  reset(): void {
    this.blockCount = 0
  }

  getBlockCount(): number {
    return this.blockCount
  }
}
