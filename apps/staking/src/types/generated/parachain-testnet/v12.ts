import type {Result, Option} from './support'

export type NominatorAdded = NominatorAdded_AddedToTop | NominatorAdded_AddedToBottom

export interface NominatorAdded_AddedToTop {
    __kind: 'AddedToTop'
    newTotal: bigint
}

export interface NominatorAdded_AddedToBottom {
    __kind: 'AddedToBottom'
}

export interface Nominator {
    id: Uint8Array
    nominations: Bond[]
    total: bigint
    lessTotal: bigint
}

export interface Bond {
    owner: Uint8Array
    amount: bigint
}
