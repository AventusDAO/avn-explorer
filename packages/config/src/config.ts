import environment from './environments'
import { ProcessorConfig } from './types'

export const getConfig = (): ProcessorConfig => {
  const archive = process.env.ARCHIVE_URL
  if (!archive) throw new Error(`missing ARCHIVE_URL env var`)

  let blockRange: ProcessorConfig['blockRange'] | undefined
  if (process.env.PROCESSOR_RANGE_FROM) {
    const from = parseInt(process.env.PROCESSOR_RANGE_FROM)
    const to = process.env.PROCESSOR_RANGE_TO ? parseInt(process.env.PROCESSOR_RANGE_TO) : undefined
    blockRange = {
      from,
      to
    }
  }

  const batchSize = process.env.PROCESSOR_BATCH_SIZE
    ? parseInt(process.env.PROCESSOR_BATCH_SIZE)
    : undefined

  const { prefix, endpoint: chain, typesBundle } = environment

  return {
    prefix,
    dataSource: {
      archive,
      chain
    },
    typesBundle,
    batchSize,
    blockRange,
    prometheusPort: process.env.PROCESSOR_PROMETHEUS_PORT
  }
}

