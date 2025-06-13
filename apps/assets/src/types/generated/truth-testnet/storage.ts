import assert from 'assert'
import {Block, BlockContext, Chain, ChainContext, Option, Result, StorageBase} from './support'
import * as v3 from './v3'

export class AssetRegistryMetadataStorage extends StorageBase {
    protected getPrefix() {
        return 'AssetRegistry'
    }

    protected getName() {
        return 'Metadata'
    }

    /**
     *  The metadata of an asset, indexed by asset id.
     */
    get isV3(): boolean {
        return this.getTypeHash() === '54b2714e9ce4d80da5d40060c9cf73fce6026817103c4390cf88f7ec7ec0af96'
    }

    /**
     *  The metadata of an asset, indexed by asset id.
     */
    get asV3(): AssetRegistryMetadataStorageV3 {
        assert(this.isV3)
        return this as any
    }
}

/**
 *  The metadata of an asset, indexed by asset id.
 */
export interface AssetRegistryMetadataStorageV3 {
    get(key: v3.Asset): Promise<(v3.AssetMetadata | undefined)>
    getAll(): Promise<v3.AssetMetadata[]>
    getMany(keys: v3.Asset[]): Promise<(v3.AssetMetadata | undefined)[]>
    getKeys(): Promise<v3.Asset[]>
    getKeys(key: v3.Asset): Promise<v3.Asset[]>
    getKeysPaged(pageSize: number): AsyncIterable<v3.Asset[]>
    getKeysPaged(pageSize: number, key: v3.Asset): AsyncIterable<v3.Asset[]>
    getPairs(): Promise<[k: v3.Asset, v: v3.AssetMetadata][]>
    getPairs(key: v3.Asset): Promise<[k: v3.Asset, v: v3.AssetMetadata][]>
    getPairsPaged(pageSize: number): AsyncIterable<[k: v3.Asset, v: v3.AssetMetadata][]>
    getPairsPaged(pageSize: number, key: v3.Asset): AsyncIterable<[k: v3.Asset, v: v3.AssetMetadata][]>
}

export class TokensAccountsStorage extends StorageBase {
    protected getPrefix() {
        return 'Tokens'
    }

    protected getName() {
        return 'Accounts'
    }

    /**
     *  The balance of a token type under an account.
     * 
     *  NOTE: If the total is ever zero, decrease account ref account.
     * 
     *  NOTE: This is only used in the case that this module is used to store
     *  balances.
     */
    get isV3(): boolean {
        return this.getTypeHash() === 'f2fa752da53432421bbf6e77907d1074fc26e5b436727454fd66c2b1004a43fa'
    }

    /**
     *  The balance of a token type under an account.
     * 
     *  NOTE: If the total is ever zero, decrease account ref account.
     * 
     *  NOTE: This is only used in the case that this module is used to store
     *  balances.
     */
    get asV3(): TokensAccountsStorageV3 {
        assert(this.isV3)
        return this as any
    }
}

/**
 *  The balance of a token type under an account.
 * 
 *  NOTE: If the total is ever zero, decrease account ref account.
 * 
 *  NOTE: This is only used in the case that this module is used to store
 *  balances.
 */
export interface TokensAccountsStorageV3 {
    get(key1: Uint8Array, key2: v3.Asset): Promise<v3.Type_440>
    getAll(): Promise<v3.Type_440[]>
    getMany(keys: [Uint8Array, v3.Asset][]): Promise<v3.Type_440[]>
    getKeys(): Promise<[Uint8Array, v3.Asset][]>
    getKeys(key1: Uint8Array): Promise<[Uint8Array, v3.Asset][]>
    getKeys(key1: Uint8Array, key2: v3.Asset): Promise<[Uint8Array, v3.Asset][]>
    getKeysPaged(pageSize: number): AsyncIterable<[Uint8Array, v3.Asset][]>
    getKeysPaged(pageSize: number, key1: Uint8Array): AsyncIterable<[Uint8Array, v3.Asset][]>
    getKeysPaged(pageSize: number, key1: Uint8Array, key2: v3.Asset): AsyncIterable<[Uint8Array, v3.Asset][]>
    getPairs(): Promise<[k: [Uint8Array, v3.Asset], v: v3.Type_440][]>
    getPairs(key1: Uint8Array): Promise<[k: [Uint8Array, v3.Asset], v: v3.Type_440][]>
    getPairs(key1: Uint8Array, key2: v3.Asset): Promise<[k: [Uint8Array, v3.Asset], v: v3.Type_440][]>
    getPairsPaged(pageSize: number): AsyncIterable<[k: [Uint8Array, v3.Asset], v: v3.Type_440][]>
    getPairsPaged(pageSize: number, key1: Uint8Array): AsyncIterable<[k: [Uint8Array, v3.Asset], v: v3.Type_440][]>
    getPairsPaged(pageSize: number, key1: Uint8Array, key2: v3.Asset): AsyncIterable<[k: [Uint8Array, v3.Asset], v: v3.Type_440][]>
}
