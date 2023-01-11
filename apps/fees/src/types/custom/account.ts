import { Address } from '@avn/types'

export interface IFeePaidData {
  /** address id that paid */
  who: Address
  /** fee + tip */
  actualFee: bigint
  /** tip alone */
  tip: bigint
}

export interface IFeesAccountUpdate {
  id: Address
  fees: bigint[]
  tips: bigint[]
}
