import { TypeormDatabase } from '@subsquid/typeorm-store'
import { config, getProcessor } from '@avn/config'

const processor = getProcessor()
  .setBatchSize(config.batchSize ?? 500)
  .setDataSource(config.dataSource)
  .setBlockRange(config.blockRange ?? { from: 0 })
  .includeAllBlocks()

const processStaking = async (): Promise<void> => {}

processor.run(new TypeormDatabase(), processStaking)
