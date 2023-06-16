import { AvnEnvironment, ChainGen, NetworkPrefix } from './types'
import path from 'path'

export const getTypesBundle = (typesBundleFileName: string): any => {
  const filePath = path.join(__dirname, '../../metadata', typesBundleFileName)
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const typesBundle = require(filePath)
  return typesBundle
}

export const getEnvironment = (): AvnEnvironment => {
  const { CHAIN_URL, ARCHIVE_GATEWAY_URL, PREFIX } = process.env
  if (!CHAIN_URL || !ARCHIVE_GATEWAY_URL)
    throw new Error('missing CHAIN_URL or ARCHIVE_GATEWAY_URL env var')
  const prefix = PREFIX ? parseInt(PREFIX) : NetworkPrefix.substrate
  const chainGen = CHAIN_URL.includes('parachain') ? ChainGen.parachain : ChainGen.solochain
  const typesBundleFileName = process.env.TYPES_BUNDLE_FILE_NAME
  const typesBundle = typesBundleFileName ? getTypesBundle(typesBundleFileName) : undefined

  return {
    dataSource: {
      chain: CHAIN_URL,
      archive: ARCHIVE_GATEWAY_URL
    },
    prefix,
    chainGen,
    typesBundle
  }
}

export default getEnvironment()
