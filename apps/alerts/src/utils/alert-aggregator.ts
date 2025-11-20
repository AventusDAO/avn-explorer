import { Alert } from '../model'

export interface BlockProcessingResult {
  alerts: Alert[]
}

export function aggregateAlerts(
  blockResults: Array<BlockProcessingResult | null | undefined>
): Alert[] {
  const allAlerts: Alert[] = []

  for (const result of blockResults) {
    if (result && result.alerts) {
      allAlerts.push(...result.alerts)
    }
  }

  return allAlerts
}

export interface AggregationStats {
  totalAlerts: number
  blockCount: number
  blocksWithAlerts: number
  averageAlertsPerBlock: number
}

export function aggregateAlertsWithStats(
  blockResults: Array<BlockProcessingResult | null | undefined>
): {
  alerts: Alert[]
  stats: AggregationStats
} {
  const alerts = aggregateAlerts(blockResults)
  const blockCount = blockResults.length
  const blocksWithAlerts = blockResults.filter(
    result => result && result.alerts && result.alerts.length > 0
  ).length

  return {
    alerts,
    stats: {
      totalAlerts: alerts.length,
      blockCount,
      blocksWithAlerts,
      averageAlertsPerBlock: blockCount > 0 ? alerts.length / blockCount : 0
    }
  }
}

