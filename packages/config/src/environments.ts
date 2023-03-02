import { AvnEnvironment, NetworkPrefix } from './types'

export const environments: AvnEnvironment[] = [
  {
    name: 'parachain-dev',
    endpoint: 'wss://avn-parachain.dev.aventus.io',
    prefix: NetworkPrefix.substrate
  },
  {
    name: 'testnet',
    endpoint: 'wss://avn-parachain.public-testnet.aventus.io',
    prefix: NetworkPrefix.substrate
  },
  {
    name: 'mainnet',
    endpoint: 'wss://avn-parachain.mainnet.aventus.io',
    prefix: NetworkPrefix.substrate
  }
]

const getAvnEnvironment = (): AvnEnvironment => {
  const envName = process.env.AVN_ENV
  if (!envName) throw new Error('missing AVN_ENV env var')
  const env = environments.find(e => e.name === envName)
  if (!env) throw new Error('invalid AVN_ENV env var')
  return env
}

export default getAvnEnvironment()
