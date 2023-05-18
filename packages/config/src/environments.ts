import { AvnEnvironment, NetworkPrefix } from './types'

export const environments: AvnEnvironment[] = [
  {
    name: 'solochain-dev',
    dataSource: {
      chain: 'wss://avn.uat.aventus.io',
      archive: 'https://solo-archive-gateway.dev.aventus.io/graphql'
    },
    prefix: NetworkPrefix.substrate
  },
  {
    name: 'solochain-testnet',
    dataSource: {
      chain: 'wss://avn.testnet.aventus.io',
      archive: 'https://solo-archive-gateway.public-testnet.aventus.io/graphql'
    },
    prefix: NetworkPrefix.substrate
  },
  {
    name: 'solochain-mainnet',
    dataSource: {
      chain: 'wss://avn.aventus.io',
      archive: 'https://solo-archive-gateway.mainnet.aventus.io/graphql'
    },
    prefix: NetworkPrefix.substrate
  },
  {
    name: 'parachain-dev',
    dataSource: {
      chain: 'wss://avn-parachain.dev.aventus.io',
      archive: 'https://archive-gateway.dev.aventus.io/graphql'
    },
    prefix: NetworkPrefix.substrate
  },
  {
    name: 'parachain-testnet',
    dataSource: {
      chain: 'wss://avn-parachain.public-testnet.aventus.io',
      archive: 'https://archive-gateway.public-testnet.aventus.io/graphql'
    },
    prefix: NetworkPrefix.substrate
  },
  {
    name: 'parachain-mainnet',
    dataSource: {
      chain: 'wss://avn-parachain.mainnet.aventus.io',
      archive: 'https://archive-gateway.mainnet.aventus.io/graphql'
    },
    prefix: NetworkPrefix.substrate
  }
]

const getAvnEnvironment = (): AvnEnvironment => {
  const envName = process.env.AVN_ENV
  if (!envName) throw new Error('missing AVN_ENV env var')
  const env = environments.find(e => e.name === envName)
  if (!env) throw new Error(`invalid AVN_ENV env var "${envName}"`)
  return env
}

export default getAvnEnvironment()
