import { Address } from '@avn/types'
import { ChainContext, Event } from '../generated/parachain-dev/support'

export type IEventHandler<T = any> = (ctx: ChainContext, event: Event) => T

export interface INominationData {
  id: Address
  total: bigint
}

export interface IRewardedData {
  id: Address
  amount: bigint
}

export interface IStakingAccountUpdate {
  id: Address
  hasNominations: boolean
  nominationsTotal?: bigint
  rewards: bigint[]
}

export interface IMigratedData {
  nominator: string
  totalStake: bigint
}
