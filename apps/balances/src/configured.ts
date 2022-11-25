import { SubstrateBatchProcessor } from '@subsquid/substrate-processor'
import config from './config'

export const getProcessor = (): SubstrateBatchProcessor => {
  const processor = new SubstrateBatchProcessor()
    .setBatchSize(config.batchSize ?? 300)
    .setDataSource(config.dataSource)
    .setBlockRange(config.blockRange ?? { from: 0 })

  if (config.typesBundle) processor.setTypesBundle(config.typesBundle)
  if (config.prometheusPort) processor.setPrometheusPort(config.prometheusPort)
  if (config.blockRange) processor.setBlockRange(config.blockRange)

  return processor
}
