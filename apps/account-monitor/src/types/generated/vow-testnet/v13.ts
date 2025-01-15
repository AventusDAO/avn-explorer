import type {Result, Option} from './support'

export type Asset = Asset_CategoricalOutcome | Asset_ScalarOutcome | Asset_CombinatorialOutcome | Asset_PoolShare | Asset_Vow | Asset_ForeignAsset | Asset_ParimutuelShare

export interface Asset_CategoricalOutcome {
    __kind: 'CategoricalOutcome'
    value: [bigint, number]
}

export interface Asset_ScalarOutcome {
    __kind: 'ScalarOutcome'
    value: [bigint, ScalarPosition]
}

export interface Asset_CombinatorialOutcome {
    __kind: 'CombinatorialOutcome'
}

export interface Asset_PoolShare {
    __kind: 'PoolShare'
    value: bigint
}

export interface Asset_Vow {
    __kind: 'Vow'
}

export interface Asset_ForeignAsset {
    __kind: 'ForeignAsset'
    value: number
}

export interface Asset_ParimutuelShare {
    __kind: 'ParimutuelShare'
    value: [bigint, number]
}

export type Strategy = Strategy_ImmediateOrCancel | Strategy_LimitOrder

export interface Strategy_ImmediateOrCancel {
    __kind: 'ImmediateOrCancel'
}

export interface Strategy_LimitOrder {
    __kind: 'LimitOrder'
}

export interface Proof {
    signer: Uint8Array
    relayer: Uint8Array
    signature: MultiSignature
}

export type MarketPeriod = MarketPeriod_Block | MarketPeriod_Timestamp

export interface MarketPeriod_Block {
    __kind: 'Block'
    value: Range
}

export interface MarketPeriod_Timestamp {
    __kind: 'Timestamp'
    value: Type_152
}

export interface Deadlines {
    gracePeriod: number
    oracleDuration: number
    disputeDuration: number
}

export type MultiHash = MultiHash_Sha3_384

export interface MultiHash_Sha3_384 {
    __kind: 'Sha3_384'
    value: Uint8Array
}

export type MarketType = MarketType_Categorical | MarketType_Scalar

export interface MarketType_Categorical {
    __kind: 'Categorical'
    value: number
}

export interface MarketType_Scalar {
    __kind: 'Scalar'
    value: RangeInclusive
}

export type MarketDisputeMechanism = MarketDisputeMechanism_Authorized | MarketDisputeMechanism_Court

export interface MarketDisputeMechanism_Authorized {
    __kind: 'Authorized'
}

export interface MarketDisputeMechanism_Court {
    __kind: 'Court'
}

export type ScalarPosition = ScalarPosition_Long | ScalarPosition_Short

export interface ScalarPosition_Long {
    __kind: 'Long'
}

export interface ScalarPosition_Short {
    __kind: 'Short'
}

export type MultiSignature = MultiSignature_Ed25519 | MultiSignature_Sr25519 | MultiSignature_Ecdsa

export interface MultiSignature_Ed25519 {
    __kind: 'Ed25519'
    value: Uint8Array
}

export interface MultiSignature_Sr25519 {
    __kind: 'Sr25519'
    value: Uint8Array
}

export interface MultiSignature_Ecdsa {
    __kind: 'Ecdsa'
    value: Uint8Array
}

export interface Range {
    start: number
    end: number
}

export interface Type_152 {
    start: bigint
    end: bigint
}

export interface RangeInclusive {
    start: bigint
    end: bigint
}
