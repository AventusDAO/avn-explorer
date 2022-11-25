import { AvnEnvironement, NetworkPrefix } from './types'

export const environements: AvnEnvironement[] = [
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

export default getAvnEnvironement()
