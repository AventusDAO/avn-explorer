import type {Result, Option} from './support'

export interface RootId {
    range: RootRange
    ingressCounter: bigint
}

export interface Validator {
    accountId: Uint8Array
    key: Uint8Array
}

export interface RootRange {
    fromBlock: number
    toBlock: number
}
