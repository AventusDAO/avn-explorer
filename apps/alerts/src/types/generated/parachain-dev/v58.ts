import type {Result, Option} from './support'

export interface AccountData {
    free: bigint
    reserved: bigint
    miscFrozen: bigint
    feeFrozen: bigint
}

export type Request = Request_Send | Request_LowerProof

export interface Request_Send {
    __kind: 'Send'
    value: SendRequestData
}

export interface Request_LowerProof {
    __kind: 'LowerProof'
    value: LowerProofRequestData
}

export interface AccountInfo {
    nonce: number
    consumers: number
    providers: number
    sufficients: number
    data: AccountData
}

export interface SendRequestData {
    txId: number
    functionName: Uint8Array
    params: [Uint8Array, Uint8Array][]
    callerId: Uint8Array
}

export interface LowerProofRequestData {
    lowerId: number
    params: Uint8Array
    callerId: Uint8Array
}
