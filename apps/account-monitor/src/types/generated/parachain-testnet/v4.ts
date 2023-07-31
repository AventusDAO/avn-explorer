import type { Result, Option } from './support'

export type NftSaleType = NftSaleType_Unknown | NftSaleType_Ethereum | NftSaleType_Fiat

export interface NftSaleType_Unknown {
  __kind: 'Unknown'
}

export interface NftSaleType_Ethereum {
  __kind: 'Ethereum'
}

export interface NftSaleType_Fiat {
  __kind: 'Fiat'
}

export interface AccountData {
  free: bigint
  reserved: bigint
  miscFrozen: bigint
  feeFrozen: bigint
}

export interface AccountInfo {
  nonce: number
  consumers: number
  providers: number
  sufficients: number
  data: AccountData
}
