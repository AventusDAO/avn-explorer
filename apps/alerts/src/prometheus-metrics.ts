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

function extractAccountFromBalanceAlert(message: string): string | null {
  const match = message.match(/Balance (?:warning|danger) for account ([^:]+):/)
  return match ? match[1].trim() : null
}

function extractEventNameFromAlert(message: string): string | null {
  const match = message.match(/Event ([A-Za-z][A-Za-z0-9_]*\.[A-Za-z][A-Za-z0-9_]*) occurred/)
  return match ? match[1].trim() : null
}

function extractQueueNameFromAlert(message: string): string | null {
  const match = message.match(/Queue (?:warning|error) for ([^:]+):/)
  return match ? match[1].trim() : null
}

export async function updatePrometheusMetrics(
  store: Store,
  isFullUpdate: boolean = false
): Promise<void> {
  const now = new Date()

  const activeAlerts = await store.find(Alert, {
    where: {
      expireAt: MoreThan(now)
    }
  })

  if (isFullUpdate) {
    balanceWarningGauge.reset()
    balanceErrorGauge.reset()
    eventWarningGauge.reset()
    eventErrorGauge.reset()
    queueWarningGauge.reset()
    queueErrorGauge.reset()
  }

  const seenAccounts = new Set<string>()
  const seenQueues = new Set<string>()
  const eventWarningCounts = new Map<string, number>()
  const eventErrorCounts = new Map<string, number>()

  for (const alert of activeAlerts) {
    if (alert.alertMessage.includes('Balance')) {
      const account = extractAccountFromBalanceAlert(alert.alertMessage)
      if (account) {
        seenAccounts.add(account)
        if (alert.isWarning) {
          balanceWarningGauge.set({ account }, 1)
        }
        if (alert.isError) {
          balanceErrorGauge.set({ account }, 1)
        }
      }
    } else if (alert.alertMessage.includes('Event')) {
      const eventName = extractEventNameFromAlert(alert.alertMessage)
      if (eventName) {
        if (alert.isWarning) {
          eventWarningCounts.set(eventName, (eventWarningCounts.get(eventName) || 0) + 1)
        }
        if (alert.isError) {
          eventErrorCounts.set(eventName, (eventErrorCounts.get(eventName) || 0) + 1)
        }
      }
    } else if (alert.alertMessage.includes('Queue')) {
      const queueName = extractQueueNameFromAlert(alert.alertMessage)
      if (queueName) {
        seenQueues.add(queueName)
        if (alert.isWarning) {
          queueWarningGauge.set({ queue: queueName }, 1)
        }
        if (alert.isError) {
          queueErrorGauge.set({ queue: queueName }, 1)
        }
      }
    }
  }

  for (const [sectionMethod, count] of eventWarningCounts.entries()) {
    eventWarningGauge.set({ section_method: sectionMethod }, count)
  }
  for (const [sectionMethod, count] of eventErrorCounts.entries()) {
    eventErrorGauge.set({ section_method: sectionMethod }, count)
  }

  if (isFullUpdate) {
    const allBalanceAlerts = await store.find(Alert, {
      where: {
        alertMessage: MoreThan('') // Get all alerts
      }
    })

    const allAccounts = new Set<string>()
    for (const alert of allBalanceAlerts) {
      if (alert.alertMessage.includes('Balance')) {
        const account = extractAccountFromBalanceAlert(alert.alertMessage)
        if (account) {
          allAccounts.add(account)
        }
      }
    }

    for (const account of allAccounts) {
      if (!seenAccounts.has(account)) {
        balanceWarningGauge.set({ account }, 0)
        balanceErrorGauge.set({ account }, 0)
      }
    }

    // For queue alerts: set queues without active alerts to 0
    const allQueueAlerts = await store.find(Alert, {
      where: {
        alertMessage: MoreThan('')
      }
    })

    const allQueues = new Set<string>()
    for (const alert of allQueueAlerts) {
      if (alert.alertMessage.includes('Queue')) {
        const queueName = extractQueueNameFromAlert(alert.alertMessage)
        if (queueName) {
          allQueues.add(queueName)
        }
      }
    }

    for (const queue of allQueues) {
      if (!seenQueues.has(queue)) {
        queueWarningGauge.set({ queue }, 0)
        queueErrorGauge.set({ queue }, 0)
      }
    }
  }
}

export async function updatePrometheusMetricsIncremental(
  store: Store,
  newAlerts: Alert[]
): Promise<void> {
  if (newAlerts.length > 0) {
    await updatePrometheusMetrics(store, true)
  }
}
