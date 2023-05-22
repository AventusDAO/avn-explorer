import type { Result, Option } from './support'

export interface RootId {
  range: RootRange
  ingressCounter: bigint
}

export interface RootRange {
  fromBlock: number
  toBlock: number
}
