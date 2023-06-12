import { AvnEnvironment, ChainGen, NetworkPrefix } from './types'

export const getEnvironment = (): AvnEnvironment => {
  const { CHAIN_URL, ARCHIVE_GATEWAY_URL, PREFIX } = process.env
  if (!CHAIN_URL || !ARCHIVE_GATEWAY_URL) throw new Error('missing AVN_ENV env var')
  const prefix = PREFIX ? parseInt(PREFIX) : NetworkPrefix.substrate
  const chainGen = CHAIN_URL.includes('parachain') ? ChainGen.parachain : ChainGen.solochain
  return {
    dataSource: {
      chain: CHAIN_URL,
      archive: ARCHIVE_GATEWAY_URL
    },
    prefix,
    chainGen
  }
}

export default getEnvironment()
