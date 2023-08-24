import assert from 'assert'
import {Block, BlockContext, Chain, ChainContext, Option, Result, StorageBase} from './support'
import * as v4 from './v4'

export class NftManagerNftInfosStorage extends StorageBase {
    protected getPrefix() {
        return 'NftManager'
    }

    protected getName() {
        return 'NftInfos'
    }

    /**
     *  A mapping between NFT info Id and info data
     */
    get isV4(): boolean {
        return this.getTypeHash() === '9ea985f300029ae4b4fdd1d90aa971d35c3a35ed65bfdbe59be956448f1c09da'
    }

    /**
     *  A mapping between NFT info Id and info data
     */
    get asV4(): NftManagerNftInfosStorageV4 {
        assert(this.isV4)
        return this as any
    }
}

/**
 *  A mapping between NFT info Id and info data
 */
export interface NftManagerNftInfosStorageV4 {
    get(key: bigint): Promise<(v4.NftInfo | undefined)>
    getAll(): Promise<v4.NftInfo[]>
    getMany(keys: bigint[]): Promise<(v4.NftInfo | undefined)[]>
    getKeys(): Promise<bigint[]>
    getKeys(key: bigint): Promise<bigint[]>
    getKeysPaged(pageSize: number): AsyncIterable<bigint[]>
    getKeysPaged(pageSize: number, key: bigint): AsyncIterable<bigint[]>
    getPairs(): Promise<[k: bigint, v: v4.NftInfo][]>
    getPairs(key: bigint): Promise<[k: bigint, v: v4.NftInfo][]>
    getPairsPaged(pageSize: number): AsyncIterable<[k: bigint, v: v4.NftInfo][]>
    getPairsPaged(pageSize: number, key: bigint): AsyncIterable<[k: bigint, v: v4.NftInfo][]>
}

export class NftManagerNftsStorage extends StorageBase {
    protected getPrefix() {
        return 'NftManager'
    }

    protected getName() {
        return 'Nfts'
    }

    /**
     *  A mapping between NFT Id and data
     */
    get isV4(): boolean {
        return this.getTypeHash() === '50f35cd0a15d899320a9f067dc26e4634be02523e5ccb84abe5b66e47d100787'
    }

    /**
     *  A mapping between NFT Id and data
     */
    get asV4(): NftManagerNftsStorageV4 {
        assert(this.isV4)
        return this as any
    }
}

/**
 *  A mapping between NFT Id and data
 */
export interface NftManagerNftsStorageV4 {
    get(key: bigint): Promise<(v4.Nft | undefined)>
    getAll(): Promise<v4.Nft[]>
    getMany(keys: bigint[]): Promise<(v4.Nft | undefined)[]>
    getKeys(): Promise<bigint[]>
    getKeys(key: bigint): Promise<bigint[]>
    getKeysPaged(pageSize: number): AsyncIterable<bigint[]>
    getKeysPaged(pageSize: number, key: bigint): AsyncIterable<bigint[]>
    getPairs(): Promise<[k: bigint, v: v4.Nft][]>
    getPairs(key: bigint): Promise<[k: bigint, v: v4.Nft][]>
    getPairsPaged(pageSize: number): AsyncIterable<[k: bigint, v: v4.Nft][]>
    getPairsPaged(pageSize: number, key: bigint): AsyncIterable<[k: bigint, v: v4.Nft][]>
}
