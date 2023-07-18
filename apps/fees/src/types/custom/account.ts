import { Address } from '@avn/types'

export interface IFeePaidData {
  /** address id that paid */
  who: Address
  /** fee + tip */
  actualFee: bigint
  /** tip alone */
  tip: bigint
  extrinsic?: {
    hash: string
  }
}

export interface IFeePaidAdjustedData {
  /** address id that paid */
  who: Address
  /** adjusted fee */
  fee: bigint
  extrinsic?: {
    hash: string
  }
}

export interface IFeesAccountUpdate {
  id: Address
  fees: bigint[]
  tips: bigint[]
}
