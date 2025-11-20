import { Store } from '@subsquid/typeorm-store'
import { Alert } from '../model'
import {
  updatePrometheusMetricsIncremental,
  updatePrometheusMetricsFull
} from '../prometheus-metrics'

export interface MetricsUpdateOptions {
  fullUpdateInterval?: number
  async?: boolean
}

export class MetricsUpdater {
  private blockCount = 0
  private readonly fullUpdateInterval: number
  private readonly async: boolean
  private updatePromise: Promise<void> | null = null

  constructor(options: MetricsUpdateOptions = {}) {
    this.fullUpdateInterval = options.fullUpdateInterval ?? 100
    this.async = options.async ?? false
  }

  async updateMetrics(
    store: Store,
    newAlerts: Alert[],
    log?: any
  ): Promise<void> {
    this.blockCount++

    const shouldDoFullUpdate = this.blockCount % this.fullUpdateInterval === 0

    const updateFn = async () => {
      try {
        const hasEventAlerts = newAlerts.some(alert => alert.alertMessage.includes('Event'))
        
        if (shouldDoFullUpdate || hasEventAlerts) {
          await updatePrometheusMetricsFull(store)
          if (log) {
            if (shouldDoFullUpdate) {
              log.debug(
                `Full metrics update (block count: ${this.blockCount}, interval: ${this.fullUpdateInterval})`
              )
            } else {
              log.debug(`Full metrics update (event alerts detected for accurate counts)`)
            }
          }
        } else if (newAlerts.length > 0) {
          await updatePrometheusMetricsIncremental(store, newAlerts)
          if (log) {
            log.debug(`Incremental metrics update with ${newAlerts.length} new alerts`)
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error)
        if (log) {
          log.warn(`Failed to update metrics: ${errorMessage}`)
        }
      }
    }

    if (this.async) {
      if (this.updatePromise) {
        await this.updatePromise.catch(() => {
        })
      }
      this.updatePromise = updateFn()
    } else {
      await updateFn()
    }
  }

  async forceFullUpdate(store: Store, log?: any): Promise<void> {
    try {
      await updatePrometheusMetricsFull(store)
      if (log) {
        log.debug('Forced full metrics update')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error)
      if (log) {
        log.warn(`Failed to force full metrics update: ${errorMessage}`)
      }
    }
  }

  reset(): void {
    this.blockCount = 0
  }

  getBlockCount(): number {
    return this.blockCount
  }
}

