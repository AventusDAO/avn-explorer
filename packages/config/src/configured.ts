import { SubstrateBatchProcessor } from '@subsquid/substrate-processor'
import config from './config'

export interface ProcessorOptions {
  events: string[]
}

export const getProcessor = (options?: ProcessorOptions): SubstrateBatchProcessor => {
  const processor = new SubstrateBatchProcessor()
    .setBatchSize(config.batchSize ?? 300)
    .setDataSource(config.dataSource)
    .setBlockRange(config.blockRange ?? { from: 0 })

  options?.events.forEach(eventName => {
    processor.addEvent(eventName, {
      data: { event: { args: true } }
    } as const)
  })

  if (config.typesBundle) processor.setTypesBundle(config.typesBundle)
  if (config.prometheusPort) processor.setPrometheusPort(config.prometheusPort)
  if (config.blockRange) processor.setBlockRange(config.blockRange)

  return processor
}
