import { Gauge, register } from 'prom-client'
import { Store } from '@subsquid/typeorm-store'
import { Alert } from './model'
import { MoreThan } from 'typeorm'

export const balanceWarningGauge = new Gauge({
  name: 'avn_balance_warning',
  help: 'Balance warning alert per account (1=warning, 0=ok). Account address shown in label.',
  labelNames: ['account'],
  registers: [register]
})

export const balanceErrorGauge = new Gauge({
  name: 'avn_balance_error',
  help: 'Balance error alert per account (1=error, 0=ok). Account address shown in label.',
  labelNames: ['account'],
  registers: [register]
})

export const eventWarningGauge = new Gauge({
  name: 'avn_event_warning',
  help: 'Event warning alert per event occurrence. Section.method (e.g., "Balances.Transfer") shown in label.',
  labelNames: ['section_method'],
  registers: [register]
})

export const eventErrorGauge = new Gauge({
  name: 'avn_event_error',
  help: 'Event error alert per event occurrence. Section.method (e.g., "System.ExtrinsicFailed") shown in label.',
  labelNames: ['section_method'],
  registers: [register]
})

export const queueWarningGauge = new Gauge({
  name: 'avn_queue_warning',
  help: 'Queue warning alert per queue (1=warning, 0=ok). Queue name shown in label.',
  labelNames: ['queue'],
  registers: [register]
})

export const queueErrorGauge = new Gauge({
  name: 'avn_queue_error',
  help: 'Queue error alert per queue (1=error, 0=ok). Queue name shown in label.',
  labelNames: ['queue'],
  registers: [register]
})

/**
 * Full metrics update - queries all active alerts and updates all metrics
 * Use this for periodic full updates or initialization
 */
export async function updatePrometheusMetricsFull(store: Store): Promise<void> {
  const now = new Date()

  // Reset all gauges
  balanceWarningGauge.reset()
  balanceErrorGauge.reset()
  eventWarningGauge.reset()
  eventErrorGauge.reset()
  queueWarningGauge.reset()
  queueErrorGauge.reset()

  // Fetch all active alerts
  const activeAlerts = await store.find(Alert, {
    where: {
      expireAt: MoreThan(now)
    }
  })

  const eventWarningCounts = new Map<string, number>()
  const eventErrorCounts = new Map<string, number>()

  for (const alert of activeAlerts) {
    const identifier = alert.sourceIdentifier

    switch (alert.alertType) {
      case 'balance':
        if (alert.isWarning) {
          balanceWarningGauge.set({ account: identifier }, 1)
        }
        if (alert.isError) {
          balanceErrorGauge.set({ account: identifier }, 1)
        }
        break

      case 'event':
        if (alert.isWarning) {
          eventWarningCounts.set(identifier, (eventWarningCounts.get(identifier) || 0) + 1)
        }
        if (alert.isError) {
          eventErrorCounts.set(identifier, (eventErrorCounts.get(identifier) || 0) + 1)
        }
        break

      case 'queue':
        if (alert.isWarning) {
          queueWarningGauge.set({ queue: identifier }, 1)
        }
        if (alert.isError) {
          queueErrorGauge.set({ queue: identifier }, 1)
        }
        break
    }
  }

  // Set aggregated event counts
  for (const [sectionMethod, count] of eventWarningCounts.entries()) {
    eventWarningGauge.set({ section_method: sectionMethod }, count)
  }
  for (const [sectionMethod, count] of eventErrorCounts.entries()) {
    eventErrorGauge.set({ section_method: sectionMethod }, count)
  }
}

/**
 * Incremental metrics update - only updates metrics for new alerts
 * More efficient than full update for frequent updates
 */
export async function updatePrometheusMetricsIncremental(
  store: Store,
  newAlerts: Alert[]
): Promise<void> {
  if (newAlerts.length === 0) {
    return
  }

  const now = new Date()

  // Process only new alerts
  const seenAccounts = new Set<string>()
  const seenQueues = new Set<string>()
  const eventWarningCounts = new Map<string, number>()
  const eventErrorCounts = new Map<string, number>()

  // Filter to only active (non-expired) alerts
  const activeNewAlerts = newAlerts.filter(alert => alert.expireAt > now)

  for (const alert of activeNewAlerts) {
    const identifier = alert.sourceIdentifier

    switch (alert.alertType) {
      case 'balance':
        seenAccounts.add(identifier)
        if (alert.isWarning) {
          balanceWarningGauge.set({ account: identifier }, 1)
        }
        if (alert.isError) {
          balanceErrorGauge.set({ account: identifier }, 1)
        }
        break

      case 'event':
        if (alert.isWarning) {
          eventWarningCounts.set(identifier, (eventWarningCounts.get(identifier) || 0) + 1)
        }
        if (alert.isError) {
          eventErrorCounts.set(identifier, (eventErrorCounts.get(identifier) || 0) + 1)
        }
        break

      case 'queue':
        seenQueues.add(identifier)
        if (alert.isWarning) {
          queueWarningGauge.set({ queue: identifier }, 1)
        }
        if (alert.isError) {
          queueErrorGauge.set({ queue: identifier }, 1)
        }
        break
    }
  }

  for (const [sectionMethod, count] of eventWarningCounts.entries()) {
    eventWarningGauge.set({ section_method: sectionMethod }, count)
  }
  for (const [sectionMethod, count] of eventErrorCounts.entries()) {
    eventErrorGauge.set({ section_method: sectionMethod }, count)
  }
}
