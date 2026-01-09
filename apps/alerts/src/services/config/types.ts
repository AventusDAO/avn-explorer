export interface ConfigData {
  balances: Array<BalanceConfig>
  events: Array<EventConfig>
  queues?: Array<QueueConfig>
}

export interface BalanceConfig {
  accountAddress: string
  prometheusTags: string
  warningThreshold: string
  dangerThreshold: string
}

export interface EventConfig {
  eventName: string
  prometheusTags: string
  includeMetadata: boolean
}

export interface QueueConfig {
  queueName: string
  prometheusTags: string
  warningThreshold: string
  errorThreshold: string
}
