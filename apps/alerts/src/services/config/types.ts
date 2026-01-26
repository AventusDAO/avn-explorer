export interface ConfigData {
  balances: Array<BalanceConfig>
  events: Array<EventConfigInput>
  queues?: Array<QueueConfig>
}

export interface BalanceConfig {
  accountAddress: string
  prometheusTags: string
  warningThreshold: string
  dangerThreshold: string
}

export type AlertSeverity = 'info' | 'warning' | 'error'

export const DEFAULT_ALERT_SEVERITY: AlertSeverity = 'warning'

/** Input config from file/env - severity is optional */
export interface EventConfigInput {
  eventName: string
  prometheusTags: string
  includeMetadata: boolean
  severity?: AlertSeverity
}

/** Resolved config with defaults applied - severity is required */
export interface EventConfig {
  eventName: string
  prometheusTags: string
  includeMetadata: boolean
  severity: AlertSeverity
}

export interface QueueConfig {
  queueName: string
  prometheusTags: string
  warningThreshold: string
  errorThreshold: string
}
