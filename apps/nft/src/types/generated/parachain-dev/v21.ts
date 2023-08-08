import type {Result, Option} from './support'

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

export interface EthEventId {
    signature: Uint8Array
    transactionHash: Uint8Array
}
