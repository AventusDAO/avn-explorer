import { NetworkPrefix, ProcessorConfig } from './types/custom/processorConfig'

interface AvnEnvironement {
  name: string
  endpoint: string
  prefix: NetworkPrefix
  /** name of the types bundle file (if they're needed) */
  typesBundle?: string
}

const environements: AvnEnvironement[] = [
  {
    name: 'parachain-dev',
    endpoint: 'wss://avn-parachain.dev.aventus.io',
    prefix: NetworkPrefix.aventus
  },
  {
    name: 'testnet',
    endpoint: 'wss://avn.test.aventus.io',
    prefix: NetworkPrefix.aventus,
    typesBundle: 'avn-types'
  }
]

const getAvnEnvironement = (): AvnEnvironement => {
  const envName = process.env.AVN_ENV
  if (!envName) throw new Error('missing AVN_ENV env var')
  const env = environements.find(e => e.name === envName)
  if (!env) throw new Error('invalid AVN_ENV env var')
  return env
}


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

  const { prefix, endpoint: chain, typesBundle } = getAvnEnvironement()

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

export default getConfig()
