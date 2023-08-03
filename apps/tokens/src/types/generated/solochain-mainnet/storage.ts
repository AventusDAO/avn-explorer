import assert from 'assert'
import {Block, BlockContext, Chain, ChainContext, Option, Result, StorageBase} from './support'

export class TokenManagerBalancesStorage extends StorageBase {
    protected getPrefix() {
        return 'TokenManager'
    }

    protected getName() {
        return 'Balances'
    }

    /**
     *  The number of units of tokens held by any given account.
     */
    get isV1(): boolean {
        return this.getTypeHash() === '70874cd5f158184b9b398819cb71b85684c5adb4e5cc9e1065d1115dac23d5f2'
    }

    /**
     *  The number of units of tokens held by any given account.
     */
    get asV1(): TokenManagerBalancesStorageV1 {
        assert(this.isV1)
        return this as any
    }
}

/**
 *  The number of units of tokens held by any given account.
 */
export interface TokenManagerBalancesStorageV1 {
    get(key: [Uint8Array, Uint8Array]): Promise<bigint>
    getAll(): Promise<bigint[]>
    getMany(keys: [Uint8Array, Uint8Array][]): Promise<bigint[]>
    getKeys(): Promise<[Uint8Array, Uint8Array][]>
    getKeys(key: [Uint8Array, Uint8Array]): Promise<[Uint8Array, Uint8Array][]>
    getKeysPaged(pageSize: number): AsyncIterable<[Uint8Array, Uint8Array][]>
    getKeysPaged(pageSize: number, key: [Uint8Array, Uint8Array]): AsyncIterable<[Uint8Array, Uint8Array][]>
    getPairs(): Promise<[k: [Uint8Array, Uint8Array], v: bigint][]>
    getPairs(key: [Uint8Array, Uint8Array]): Promise<[k: [Uint8Array, Uint8Array], v: bigint][]>
    getPairsPaged(pageSize: number): AsyncIterable<[k: [Uint8Array, Uint8Array], v: bigint][]>
    getPairsPaged(pageSize: number, key: [Uint8Array, Uint8Array]): AsyncIterable<[k: [Uint8Array, Uint8Array], v: bigint][]>
}
