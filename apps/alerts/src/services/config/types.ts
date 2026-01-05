export interface ConfigData {
  balances: Array<{
    accountAddress: string
    prometheusTags: string
    warningThreshold: string
    dangerThreshold: string
  }>
  events: Array<{
    eventName: string
    prometheusTags: string
    includeMetadata: boolean
  }>
  queues?: Array<{
    queueName: string
    prometheusTags: string
    warningThreshold: string
    errorThreshold: string
  }>
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
