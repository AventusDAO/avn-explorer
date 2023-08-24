import assert from 'assert'
import {Block, BlockContext, Chain, ChainContext, Option, Result, StorageBase} from './support'
import * as v21 from './v21'

export class NftManagerBatchInfoIdStorage extends StorageBase {
    protected getPrefix() {
        return 'NftManager'
    }

    protected getName() {
        return 'BatchInfoId'
    }

    /**
     *  A mapping between the external batch id and its corresponding NtfInfoId
     */
    get isV21(): boolean {
        return this.getTypeHash() === '562642e80114763badea02d1e1f1ca3ec06ced33d0cb004f035c6617dcb1cbfc'
    }

    /**
     *  A mapping between the external batch id and its corresponding NtfInfoId
     */
    get asV21(): NftManagerBatchInfoIdStorageV21 {
        assert(this.isV21)
        return this as any
    }
}

/**
 *  A mapping between the external batch id and its corresponding NtfInfoId
 */
export interface NftManagerBatchInfoIdStorageV21 {
    get(key: bigint): Promise<bigint>
    getAll(): Promise<bigint[]>
    getMany(keys: bigint[]): Promise<bigint[]>
    getKeys(): Promise<bigint[]>
    getKeys(key: bigint): Promise<bigint[]>
    getKeysPaged(pageSize: number): AsyncIterable<bigint[]>
    getKeysPaged(pageSize: number, key: bigint): AsyncIterable<bigint[]>
    getPairs(): Promise<[k: bigint, v: bigint][]>
    getPairs(key: bigint): Promise<[k: bigint, v: bigint][]>
    getPairsPaged(pageSize: number): AsyncIterable<[k: bigint, v: bigint][]>
    getPairsPaged(pageSize: number, key: bigint): AsyncIterable<[k: bigint, v: bigint][]>
}

export class NftManagerNftBatchesStorage extends StorageBase {
    protected getPrefix() {
        return 'NftManager'
    }

    protected getName() {
        return 'NftBatches'
    }

    /**
     *  A mapping between the external batch id and its nft Ids
     */
    get isV21(): boolean {
        return this.getTypeHash() === '7a968372960ac77ac96e560da0239c573568f7317c27f5defde03880957cbfca'
    }

    /**
     *  A mapping between the external batch id and its nft Ids
     */
    get asV21(): NftManagerNftBatchesStorageV21 {
        assert(this.isV21)
        return this as any
    }
}

/**
 *  A mapping between the external batch id and its nft Ids
 */
export interface NftManagerNftBatchesStorageV21 {
    get(key: bigint): Promise<bigint[]>
    getAll(): Promise<bigint[][]>
    getMany(keys: bigint[]): Promise<bigint[][]>
    getKeys(): Promise<bigint[]>
    getKeys(key: bigint): Promise<bigint[]>
    getKeysPaged(pageSize: number): AsyncIterable<bigint[]>
    getKeysPaged(pageSize: number, key: bigint): AsyncIterable<bigint[]>
    getPairs(): Promise<[k: bigint, v: bigint[]][]>
    getPairs(key: bigint): Promise<[k: bigint, v: bigint[]][]>
    getPairsPaged(pageSize: number): AsyncIterable<[k: bigint, v: bigint[]][]>
    getPairsPaged(pageSize: number, key: bigint): AsyncIterable<[k: bigint, v: bigint[]][]>
}

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
    get isV21(): boolean {
        return this.getTypeHash() === '9ea985f300029ae4b4fdd1d90aa971d35c3a35ed65bfdbe59be956448f1c09da'
    }

    /**
     *  A mapping between NFT info Id and info data
     */
    get asV21(): NftManagerNftInfosStorageV21 {
        assert(this.isV21)
        return this as any
    }
}

/**
 *  A mapping between NFT info Id and info data
 */
export interface NftManagerNftInfosStorageV21 {
    get(key: bigint): Promise<(v21.NftInfo | undefined)>
    getAll(): Promise<v21.NftInfo[]>
    getMany(keys: bigint[]): Promise<(v21.NftInfo | undefined)[]>
    getKeys(): Promise<bigint[]>
    getKeys(key: bigint): Promise<bigint[]>
    getKeysPaged(pageSize: number): AsyncIterable<bigint[]>
    getKeysPaged(pageSize: number, key: bigint): AsyncIterable<bigint[]>
    getPairs(): Promise<[k: bigint, v: v21.NftInfo][]>
    getPairs(key: bigint): Promise<[k: bigint, v: v21.NftInfo][]>
    getPairsPaged(pageSize: number): AsyncIterable<[k: bigint, v: v21.NftInfo][]>
    getPairsPaged(pageSize: number, key: bigint): AsyncIterable<[k: bigint, v: v21.NftInfo][]>
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
    get isV21(): boolean {
        return this.getTypeHash() === '50f35cd0a15d899320a9f067dc26e4634be02523e5ccb84abe5b66e47d100787'
    }

    /**
     *  A mapping between NFT Id and data
     */
    get asV21(): NftManagerNftsStorageV21 {
        assert(this.isV21)
        return this as any
    }
}

/**
 *  A mapping between NFT Id and data
 */
export interface NftManagerNftsStorageV21 {
    get(key: bigint): Promise<(v21.Nft | undefined)>
    getAll(): Promise<v21.Nft[]>
    getMany(keys: bigint[]): Promise<(v21.Nft | undefined)[]>
    getKeys(): Promise<bigint[]>
    getKeys(key: bigint): Promise<bigint[]>
    getKeysPaged(pageSize: number): AsyncIterable<bigint[]>
    getKeysPaged(pageSize: number, key: bigint): AsyncIterable<bigint[]>
    getPairs(): Promise<[k: bigint, v: v21.Nft][]>
    getPairs(key: bigint): Promise<[k: bigint, v: v21.Nft][]>
    getPairsPaged(pageSize: number): AsyncIterable<[k: bigint, v: v21.Nft][]>
    getPairsPaged(pageSize: number, key: bigint): AsyncIterable<[k: bigint, v: v21.Nft][]>
}
