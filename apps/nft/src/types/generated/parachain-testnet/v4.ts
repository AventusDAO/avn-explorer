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

export interface NftInfo {
    infoId: bigint
    batchId: (bigint | undefined)
    royalties: Royalty[]
    totalSupply: bigint
    t1Authority: Uint8Array
    creator: (Uint8Array | undefined)
}

export interface Nft {
    nftId: bigint
    infoId: bigint
    uniqueExternalRef: Uint8Array
    nonce: bigint
    owner: Uint8Array
    isLocked: boolean
}

export interface Royalty {
    recipientT1Address: Uint8Array
    rate: RoyaltyRate
}

export interface RoyaltyRate {
    partsPerMillion: number
}
