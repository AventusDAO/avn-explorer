import type {Result, Option} from './support'

export interface RootRange {
    fromBlock: number
    toBlock: number
}

export interface RootId {
    range: RootRange
    ingressCounter: bigint
}
