import { Address } from '@avn/types'
import { ChainContext, Event } from '../generated/parachain-dev/support'

export type IEventHandler<T = any> = (ctx: ChainContext, event: Event) => T

export interface INominator {
  id: Address
  total: bigint
}

export interface IRewardedData {
  id: Address
  amount: bigint
}
