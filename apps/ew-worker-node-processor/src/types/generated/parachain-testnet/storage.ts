import assert from 'assert'
import {Block, BlockContext, Chain, ChainContext, Option, Result, StorageBase} from './support'
import * as v50 from './v50'
import * as v56 from './v56'

export class WorkerNodePalletActiveRewardPeriodInfoStorage extends StorageBase {
    protected getPrefix() {
        return 'WorkerNodePallet'
    }

    protected getName() {
        return 'ActiveRewardPeriodInfo'
    }

    /**
     *  Current reward period index and next period scheduled transition
     */
    get isV50(): boolean {
        return this.getTypeHash() === '15f6045886604306d5dbf4f3822198e667875f8f434a0495bbd0d1d17d9961da'
    }

    /**
     *  Current reward period index and next period scheduled transition
     */
    get asV50(): WorkerNodePalletActiveRewardPeriodInfoStorageV50 {
        assert(this.isV50)
        return this as any
    }
}

/**
 *  Current reward period index and next period scheduled transition
 */
export interface WorkerNodePalletActiveRewardPeriodInfoStorageV50 {
    get(): Promise<v50.RewardPeriod>
}

export class WorkerNodePalletAllowedAccountsStorage extends StorageBase {
    protected getPrefix() {
        return 'WorkerNodePallet'
    }

    protected getName() {
        return 'AllowedAccounts'
    }

    get isV50(): boolean {
        return this.getTypeHash() === '29735300dba5135be0e1e53d771089aba86ed92479018d68d31c9d66cb9816e3'
    }

    get asV50(): WorkerNodePalletAllowedAccountsStorageV50 {
        assert(this.isV50)
        return this as any
    }
}

export interface WorkerNodePalletAllowedAccountsStorageV50 {
    get(key: Uint8Array): Promise<(null | undefined)>
    getAll(): Promise<null[]>
    getMany(keys: Uint8Array[]): Promise<(null | undefined)[]>
    getKeys(): Promise<Uint8Array[]>
    getKeys(key: Uint8Array): Promise<Uint8Array[]>
    getKeysPaged(pageSize: number): AsyncIterable<Uint8Array[]>
    getKeysPaged(pageSize: number, key: Uint8Array): AsyncIterable<Uint8Array[]>
    getPairs(): Promise<[k: Uint8Array, v: null][]>
    getPairs(key: Uint8Array): Promise<[k: Uint8Array, v: null][]>
    getPairsPaged(pageSize: number): AsyncIterable<[k: Uint8Array, v: null][]>
    getPairsPaged(pageSize: number, key: Uint8Array): AsyncIterable<[k: Uint8Array, v: null][]>
}

export class WorkerNodePalletAllowedOperatorsStorage extends StorageBase {
    protected getPrefix() {
        return 'WorkerNodePallet'
    }

    protected getName() {
        return 'AllowedOperators'
    }

    /**
     *  Operators allowed to subscribe specific group
     */
    get isV50(): boolean {
        return this.getTypeHash() === 'f847497de588b7e6a455aa356a3c2a039912b6138bc2eef157f92572fc558bd2'
    }

    /**
     *  Operators allowed to subscribe specific group
     */
    get asV50(): WorkerNodePalletAllowedOperatorsStorageV50 {
        assert(this.isV50)
        return this as any
    }
}

/**
 *  Operators allowed to subscribe specific group
 */
export interface WorkerNodePalletAllowedOperatorsStorageV50 {
    get(key1: Uint8Array, key2: Uint8Array): Promise<(null | undefined)>
    getAll(): Promise<null[]>
    getMany(keys: [Uint8Array, Uint8Array][]): Promise<(null | undefined)[]>
    getKeys(): Promise<[Uint8Array, Uint8Array][]>
    getKeys(key1: Uint8Array): Promise<[Uint8Array, Uint8Array][]>
    getKeys(key1: Uint8Array, key2: Uint8Array): Promise<[Uint8Array, Uint8Array][]>
    getKeysPaged(pageSize: number): AsyncIterable<[Uint8Array, Uint8Array][]>
    getKeysPaged(pageSize: number, key1: Uint8Array): AsyncIterable<[Uint8Array, Uint8Array][]>
    getKeysPaged(pageSize: number, key1: Uint8Array, key2: Uint8Array): AsyncIterable<[Uint8Array, Uint8Array][]>
    getPairs(): Promise<[k: [Uint8Array, Uint8Array], v: null][]>
    getPairs(key1: Uint8Array): Promise<[k: [Uint8Array, Uint8Array], v: null][]>
    getPairs(key1: Uint8Array, key2: Uint8Array): Promise<[k: [Uint8Array, Uint8Array], v: null][]>
    getPairsPaged(pageSize: number): AsyncIterable<[k: [Uint8Array, Uint8Array], v: null][]>
    getPairsPaged(pageSize: number, key1: Uint8Array): AsyncIterable<[k: [Uint8Array, Uint8Array], v: null][]>
    getPairsPaged(pageSize: number, key1: Uint8Array, key2: Uint8Array): AsyncIterable<[k: [Uint8Array, Uint8Array], v: null][]>
}

export class WorkerNodePalletArchivedSolutionGroupSubscriptionsStorage extends StorageBase {
    protected getPrefix() {
        return 'WorkerNodePallet'
    }

    protected getName() {
        return 'ArchivedSolutionGroupSubscriptions'
    }

    /**
     *  Subscriptions from expired subscriptions groups that have been archived and awaiting resume
     */
    get isV50(): boolean {
        return this.getTypeHash() === 'b3c70aca69038f4a18531d571a85528ff0ab018454e65cf241284cc22da44629'
    }

    /**
     *  Subscriptions from expired subscriptions groups that have been archived and awaiting resume
     */
    get asV50(): WorkerNodePalletArchivedSolutionGroupSubscriptionsStorageV50 {
        assert(this.isV50)
        return this as any
    }
}

/**
 *  Subscriptions from expired subscriptions groups that have been archived and awaiting resume
 */
export interface WorkerNodePalletArchivedSolutionGroupSubscriptionsStorageV50 {
    get(key1: Uint8Array, key2: Uint8Array): Promise<(bigint | undefined)>
    getAll(): Promise<bigint[]>
    getMany(keys: [Uint8Array, Uint8Array][]): Promise<(bigint | undefined)[]>
    getKeys(): Promise<[Uint8Array, Uint8Array][]>
    getKeys(key1: Uint8Array): Promise<[Uint8Array, Uint8Array][]>
    getKeys(key1: Uint8Array, key2: Uint8Array): Promise<[Uint8Array, Uint8Array][]>
    getKeysPaged(pageSize: number): AsyncIterable<[Uint8Array, Uint8Array][]>
    getKeysPaged(pageSize: number, key1: Uint8Array): AsyncIterable<[Uint8Array, Uint8Array][]>
    getKeysPaged(pageSize: number, key1: Uint8Array, key2: Uint8Array): AsyncIterable<[Uint8Array, Uint8Array][]>
    getPairs(): Promise<[k: [Uint8Array, Uint8Array], v: bigint][]>
    getPairs(key1: Uint8Array): Promise<[k: [Uint8Array, Uint8Array], v: bigint][]>
    getPairs(key1: Uint8Array, key2: Uint8Array): Promise<[k: [Uint8Array, Uint8Array], v: bigint][]>
    getPairsPaged(pageSize: number): AsyncIterable<[k: [Uint8Array, Uint8Array], v: bigint][]>
    getPairsPaged(pageSize: number, key1: Uint8Array): AsyncIterable<[k: [Uint8Array, Uint8Array], v: bigint][]>
    getPairsPaged(pageSize: number, key1: Uint8Array, key2: Uint8Array): AsyncIterable<[k: [Uint8Array, Uint8Array], v: bigint][]>
}

export class WorkerNodePalletDeregisteredGroupsWithRewardsStorage extends StorageBase {
    protected getPrefix() {
        return 'WorkerNodePallet'
    }

    protected getName() {
        return 'DeregisteredGroupsWithRewards'
    }

    get isV56(): boolean {
        return this.getTypeHash() === 'd3dbfd7970b4d0d75ea4884025979f434a2c6d5b957f91a75f352d9856e69229'
    }

    get asV56(): WorkerNodePalletDeregisteredGroupsWithRewardsStorageV56 {
        assert(this.isV56)
        return this as any
    }
}

export interface WorkerNodePalletDeregisteredGroupsWithRewardsStorageV56 {
    get(key: Uint8Array): Promise<(null | undefined)>
    getAll(): Promise<null[]>
    getMany(keys: Uint8Array[]): Promise<(null | undefined)[]>
    getKeys(): Promise<Uint8Array[]>
    getKeys(key: Uint8Array): Promise<Uint8Array[]>
    getKeysPaged(pageSize: number): AsyncIterable<Uint8Array[]>
    getKeysPaged(pageSize: number, key: Uint8Array): AsyncIterable<Uint8Array[]>
    getPairs(): Promise<[k: Uint8Array, v: null][]>
    getPairs(key: Uint8Array): Promise<[k: Uint8Array, v: null][]>
    getPairsPaged(pageSize: number): AsyncIterable<[k: Uint8Array, v: null][]>
    getPairsPaged(pageSize: number, key: Uint8Array): AsyncIterable<[k: Uint8Array, v: null][]>
}

export class WorkerNodePalletEarnedRewardsStorage extends StorageBase {
    protected getPrefix() {
        return 'WorkerNodePallet'
    }

    protected getName() {
        return 'EarnedRewards'
    }

    get isV50(): boolean {
        return this.getTypeHash() === '4e61668be46007d1ebb9598b0ec4976a24d9d5a4587c0b183e1acd5ebcf5d902'
    }

    get asV50(): WorkerNodePalletEarnedRewardsStorageV50 {
        assert(this.isV50)
        return this as any
    }
}

export interface WorkerNodePalletEarnedRewardsStorageV50 {
    get(key1: Uint8Array, key2: Uint8Array): Promise<[bigint, bigint]>
    getAll(): Promise<[bigint, bigint][]>
    getMany(keys: [Uint8Array, Uint8Array][]): Promise<[bigint, bigint][]>
    getKeys(): Promise<[Uint8Array, Uint8Array][]>
    getKeys(key1: Uint8Array): Promise<[Uint8Array, Uint8Array][]>
    getKeys(key1: Uint8Array, key2: Uint8Array): Promise<[Uint8Array, Uint8Array][]>
    getKeysPaged(pageSize: number): AsyncIterable<[Uint8Array, Uint8Array][]>
    getKeysPaged(pageSize: number, key1: Uint8Array): AsyncIterable<[Uint8Array, Uint8Array][]>
    getKeysPaged(pageSize: number, key1: Uint8Array, key2: Uint8Array): AsyncIterable<[Uint8Array, Uint8Array][]>
    getPairs(): Promise<[k: [Uint8Array, Uint8Array], v: [bigint, bigint]][]>
    getPairs(key1: Uint8Array): Promise<[k: [Uint8Array, Uint8Array], v: [bigint, bigint]][]>
    getPairs(key1: Uint8Array, key2: Uint8Array): Promise<[k: [Uint8Array, Uint8Array], v: [bigint, bigint]][]>
    getPairsPaged(pageSize: number): AsyncIterable<[k: [Uint8Array, Uint8Array], v: [bigint, bigint]][]>
    getPairsPaged(pageSize: number, key1: Uint8Array): AsyncIterable<[k: [Uint8Array, Uint8Array], v: [bigint, bigint]][]>
    getPairsPaged(pageSize: number, key1: Uint8Array, key2: Uint8Array): AsyncIterable<[k: [Uint8Array, Uint8Array], v: [bigint, bigint]][]>
}

export class WorkerNodePalletGroupOfSolutionStorage extends StorageBase {
    protected getPrefix() {
        return 'WorkerNodePallet'
    }

    protected getName() {
        return 'GroupOfSolution'
    }

    /**
     *  Assosiation from hash of solution namespace to solution group
     */
    get isV50(): boolean {
        return this.getTypeHash() === 'd615172814598e4b69e04469ab40a91ec9391bfa582f645f1c0e21d723c2b9be'
    }

    /**
     *  Assosiation from hash of solution namespace to solution group
     */
    get asV50(): WorkerNodePalletGroupOfSolutionStorageV50 {
        assert(this.isV50)
        return this as any
    }
}

/**
 *  Assosiation from hash of solution namespace to solution group
 */
export interface WorkerNodePalletGroupOfSolutionStorageV50 {
    get(key: Uint8Array): Promise<(Uint8Array | undefined)>
    getAll(): Promise<Uint8Array[]>
    getMany(keys: Uint8Array[]): Promise<(Uint8Array | undefined)[]>
    getKeys(): Promise<Uint8Array[]>
    getKeys(key: Uint8Array): Promise<Uint8Array[]>
    getKeysPaged(pageSize: number): AsyncIterable<Uint8Array[]>
    getKeysPaged(pageSize: number, key: Uint8Array): AsyncIterable<Uint8Array[]>
    getPairs(): Promise<[k: Uint8Array, v: Uint8Array][]>
    getPairs(key: Uint8Array): Promise<[k: Uint8Array, v: Uint8Array][]>
    getPairsPaged(pageSize: number): AsyncIterable<[k: Uint8Array, v: Uint8Array][]>
    getPairsPaged(pageSize: number, key: Uint8Array): AsyncIterable<[k: Uint8Array, v: Uint8Array][]>
}

export class WorkerNodePalletLatestGeneratedSubscriptionStorage extends StorageBase {
    protected getPrefix() {
        return 'WorkerNodePallet'
    }

    protected getName() {
        return 'LatestGeneratedSubscription'
    }

    get isV50(): boolean {
        return this.getTypeHash() === '3922162b8bece557b2db11d8f7db39ba5839b52e7b91ced13add33d2b6ddcafb'
    }

    get asV50(): WorkerNodePalletLatestGeneratedSubscriptionStorageV50 {
        assert(this.isV50)
        return this as any
    }
}

export interface WorkerNodePalletLatestGeneratedSubscriptionStorageV50 {
    get(): Promise<v50.RewardPeriodStatus>
}

export class WorkerNodePalletLatestRewardsCalculatedStorage extends StorageBase {
    protected getPrefix() {
        return 'WorkerNodePallet'
    }

    protected getName() {
        return 'LatestRewardsCalculated'
    }

    get isV50(): boolean {
        return this.getTypeHash() === '3922162b8bece557b2db11d8f7db39ba5839b52e7b91ced13add33d2b6ddcafb'
    }

    get asV50(): WorkerNodePalletLatestRewardsCalculatedStorageV50 {
        assert(this.isV50)
        return this as any
    }
}

export interface WorkerNodePalletLatestRewardsCalculatedStorageV50 {
    get(): Promise<v50.RewardPeriodStatus>
}

export class WorkerNodePalletMaxSolutionResultLengthStorage extends StorageBase {
    protected getPrefix() {
        return 'WorkerNodePallet'
    }

    protected getName() {
        return 'MaxSolutionResultLength'
    }

    get isV50(): boolean {
        return this.getTypeHash() === 'a863022e4ed74c574d4df8778565bf755f6f88a8279ed05d8097a21bc6ec382e'
    }

    get asV50(): WorkerNodePalletMaxSolutionResultLengthStorageV50 {
        assert(this.isV50)
        return this as any
    }
}

export interface WorkerNodePalletMaxSolutionResultLengthStorageV50 {
    get(): Promise<number>
}

export class WorkerNodePalletNumberOfSubmissionsStorage extends StorageBase {
    protected getPrefix() {
        return 'WorkerNodePallet'
    }

    protected getName() {
        return 'NumberOfSubmissions'
    }

    /**
     *  Number of submissions within subscription
     */
    get isV50(): boolean {
        return this.getTypeHash() === 'd8c63b4e5f8165acf2a18d8474bb140d3ad5df6315d479b42d260ef766de5a8d'
    }

    /**
     *  Number of submissions within subscription
     */
    get asV50(): WorkerNodePalletNumberOfSubmissionsStorageV50 {
        assert(this.isV50)
        return this as any
    }
}

/**
 *  Number of submissions within subscription
 */
export interface WorkerNodePalletNumberOfSubmissionsStorageV50 {
    get(key1: Uint8Array, key2: number, key3: Uint8Array): Promise<(bigint | undefined)>
    getAll(): Promise<bigint[]>
    getMany(keys: [Uint8Array, number, Uint8Array][]): Promise<(bigint | undefined)[]>
    getKeys(): Promise<[Uint8Array, number, Uint8Array][]>
    getKeys(key1: Uint8Array): Promise<[Uint8Array, number, Uint8Array][]>
    getKeys(key1: Uint8Array, key2: number): Promise<[Uint8Array, number, Uint8Array][]>
    getKeys(key1: Uint8Array, key2: number, key3: Uint8Array): Promise<[Uint8Array, number, Uint8Array][]>
    getKeysPaged(pageSize: number): AsyncIterable<[Uint8Array, number, Uint8Array][]>
    getKeysPaged(pageSize: number, key1: Uint8Array): AsyncIterable<[Uint8Array, number, Uint8Array][]>
    getKeysPaged(pageSize: number, key1: Uint8Array, key2: number): AsyncIterable<[Uint8Array, number, Uint8Array][]>
    getKeysPaged(pageSize: number, key1: Uint8Array, key2: number, key3: Uint8Array): AsyncIterable<[Uint8Array, number, Uint8Array][]>
    getPairs(): Promise<[k: [Uint8Array, number, Uint8Array], v: bigint][]>
    getPairs(key1: Uint8Array): Promise<[k: [Uint8Array, number, Uint8Array], v: bigint][]>
    getPairs(key1: Uint8Array, key2: number): Promise<[k: [Uint8Array, number, Uint8Array], v: bigint][]>
    getPairs(key1: Uint8Array, key2: number, key3: Uint8Array): Promise<[k: [Uint8Array, number, Uint8Array], v: bigint][]>
    getPairsPaged(pageSize: number): AsyncIterable<[k: [Uint8Array, number, Uint8Array], v: bigint][]>
    getPairsPaged(pageSize: number, key1: Uint8Array): AsyncIterable<[k: [Uint8Array, number, Uint8Array], v: bigint][]>
    getPairsPaged(pageSize: number, key1: Uint8Array, key2: number): AsyncIterable<[k: [Uint8Array, number, Uint8Array], v: bigint][]>
    getPairsPaged(pageSize: number, key1: Uint8Array, key2: number, key3: Uint8Array): AsyncIterable<[k: [Uint8Array, number, Uint8Array], v: bigint][]>
}

export class WorkerNodePalletOperatorSubscriptionsStorage extends StorageBase {
    protected getPrefix() {
        return 'WorkerNodePallet'
    }

    protected getName() {
        return 'OperatorSubscriptions'
    }

    get isV50(): boolean {
        return this.getTypeHash() === 'ae66f528bc088859fea3fff14bb4bcb114153f595b184050400077eea1db0c04'
    }

    get asV50(): WorkerNodePalletOperatorSubscriptionsStorageV50 {
        assert(this.isV50)
        return this as any
    }
}

export interface WorkerNodePalletOperatorSubscriptionsStorageV50 {
    get(key1: Uint8Array, key2: Uint8Array): Promise<(null | undefined)>
    getAll(): Promise<null[]>
    getMany(keys: [Uint8Array, Uint8Array][]): Promise<(null | undefined)[]>
    getKeys(): Promise<[Uint8Array, Uint8Array][]>
    getKeys(key1: Uint8Array): Promise<[Uint8Array, Uint8Array][]>
    getKeys(key1: Uint8Array, key2: Uint8Array): Promise<[Uint8Array, Uint8Array][]>
    getKeysPaged(pageSize: number): AsyncIterable<[Uint8Array, Uint8Array][]>
    getKeysPaged(pageSize: number, key1: Uint8Array): AsyncIterable<[Uint8Array, Uint8Array][]>
    getKeysPaged(pageSize: number, key1: Uint8Array, key2: Uint8Array): AsyncIterable<[Uint8Array, Uint8Array][]>
    getPairs(): Promise<[k: [Uint8Array, Uint8Array], v: null][]>
    getPairs(key1: Uint8Array): Promise<[k: [Uint8Array, Uint8Array], v: null][]>
    getPairs(key1: Uint8Array, key2: Uint8Array): Promise<[k: [Uint8Array, Uint8Array], v: null][]>
    getPairsPaged(pageSize: number): AsyncIterable<[k: [Uint8Array, Uint8Array], v: null][]>
    getPairsPaged(pageSize: number, key1: Uint8Array): AsyncIterable<[k: [Uint8Array, Uint8Array], v: null][]>
    getPairsPaged(pageSize: number, key1: Uint8Array, key2: Uint8Array): AsyncIterable<[k: [Uint8Array, Uint8Array], v: null][]>
}

export class WorkerNodePalletOperatorToWorkerNodeStorage extends StorageBase {
    protected getPrefix() {
        return 'WorkerNodePallet'
    }

    protected getName() {
        return 'OperatorToWorkerNode'
    }

    get isV50(): boolean {
        return this.getTypeHash() === 'de3ac6d702494f77c04d74bab1d59ac44113746a3722fe8b7306730fb0fc740c'
    }

    get asV50(): WorkerNodePalletOperatorToWorkerNodeStorageV50 {
        assert(this.isV50)
        return this as any
    }
}

export interface WorkerNodePalletOperatorToWorkerNodeStorageV50 {
    get(key: Uint8Array): Promise<(Uint8Array | undefined)>
    getAll(): Promise<Uint8Array[]>
    getMany(keys: Uint8Array[]): Promise<(Uint8Array | undefined)[]>
    getKeys(): Promise<Uint8Array[]>
    getKeys(key: Uint8Array): Promise<Uint8Array[]>
    getKeysPaged(pageSize: number): AsyncIterable<Uint8Array[]>
    getKeysPaged(pageSize: number, key: Uint8Array): AsyncIterable<Uint8Array[]>
    getPairs(): Promise<[k: Uint8Array, v: Uint8Array][]>
    getPairs(key: Uint8Array): Promise<[k: Uint8Array, v: Uint8Array][]>
    getPairsPaged(pageSize: number): AsyncIterable<[k: Uint8Array, v: Uint8Array][]>
    getPairsPaged(pageSize: number, key: Uint8Array): AsyncIterable<[k: Uint8Array, v: Uint8Array][]>
}

export class WorkerNodePalletRegistrarActiveSolutionRegistryStorage extends StorageBase {
    protected getPrefix() {
        return 'WorkerNodePallet'
    }

    protected getName() {
        return 'RegistrarActiveSolutionRegistry'
    }

    /**
     *  Tracks registrar Active and Paused solutions.
     */
    get isV50(): boolean {
        return this.getTypeHash() === 'ae66f528bc088859fea3fff14bb4bcb114153f595b184050400077eea1db0c04'
    }

    /**
     *  Tracks registrar Active and Paused solutions.
     */
    get asV50(): WorkerNodePalletRegistrarActiveSolutionRegistryStorageV50 {
        assert(this.isV50)
        return this as any
    }
}

/**
 *  Tracks registrar Active and Paused solutions.
 */
export interface WorkerNodePalletRegistrarActiveSolutionRegistryStorageV50 {
    get(key1: Uint8Array, key2: Uint8Array): Promise<(null | undefined)>
    getAll(): Promise<null[]>
    getMany(keys: [Uint8Array, Uint8Array][]): Promise<(null | undefined)[]>
    getKeys(): Promise<[Uint8Array, Uint8Array][]>
    getKeys(key1: Uint8Array): Promise<[Uint8Array, Uint8Array][]>
    getKeys(key1: Uint8Array, key2: Uint8Array): Promise<[Uint8Array, Uint8Array][]>
    getKeysPaged(pageSize: number): AsyncIterable<[Uint8Array, Uint8Array][]>
    getKeysPaged(pageSize: number, key1: Uint8Array): AsyncIterable<[Uint8Array, Uint8Array][]>
    getKeysPaged(pageSize: number, key1: Uint8Array, key2: Uint8Array): AsyncIterable<[Uint8Array, Uint8Array][]>
    getPairs(): Promise<[k: [Uint8Array, Uint8Array], v: null][]>
    getPairs(key1: Uint8Array): Promise<[k: [Uint8Array, Uint8Array], v: null][]>
    getPairs(key1: Uint8Array, key2: Uint8Array): Promise<[k: [Uint8Array, Uint8Array], v: null][]>
    getPairsPaged(pageSize: number): AsyncIterable<[k: [Uint8Array, Uint8Array], v: null][]>
    getPairsPaged(pageSize: number, key1: Uint8Array): AsyncIterable<[k: [Uint8Array, Uint8Array], v: null][]>
    getPairsPaged(pageSize: number, key1: Uint8Array, key2: Uint8Array): AsyncIterable<[k: [Uint8Array, Uint8Array], v: null][]>
}

export class WorkerNodePalletRegistrarDepositStorage extends StorageBase {
    protected getPrefix() {
        return 'WorkerNodePallet'
    }

    protected getName() {
        return 'RegistrarDeposit'
    }

    get isV50(): boolean {
        return this.getTypeHash() === 'f8ebe28eb30158172c0ccf672f7747c46a244f892d08ef2ebcbaadde34a26bc0'
    }

    get asV50(): WorkerNodePalletRegistrarDepositStorageV50 {
        assert(this.isV50)
        return this as any
    }
}

export interface WorkerNodePalletRegistrarDepositStorageV50 {
    get(): Promise<bigint>
}

export class WorkerNodePalletRegistrarInventoryStorage extends StorageBase {
    protected getPrefix() {
        return 'WorkerNodePallet'
    }

    protected getName() {
        return 'RegistrarInventory'
    }

    get isV50(): boolean {
        return this.getTypeHash() === '73a73f39f6c206a3b43b701c13e87fd13264792b445e32964d486032028553c4'
    }

    get asV50(): WorkerNodePalletRegistrarInventoryStorageV50 {
        assert(this.isV50)
        return this as any
    }
}

export interface WorkerNodePalletRegistrarInventoryStorageV50 {
    get(key: Uint8Array): Promise<(v50.RegistrarInfo | undefined)>
    getAll(): Promise<v50.RegistrarInfo[]>
    getMany(keys: Uint8Array[]): Promise<(v50.RegistrarInfo | undefined)[]>
    getKeys(): Promise<Uint8Array[]>
    getKeys(key: Uint8Array): Promise<Uint8Array[]>
    getKeysPaged(pageSize: number): AsyncIterable<Uint8Array[]>
    getKeysPaged(pageSize: number, key: Uint8Array): AsyncIterable<Uint8Array[]>
    getPairs(): Promise<[k: Uint8Array, v: v50.RegistrarInfo][]>
    getPairs(key: Uint8Array): Promise<[k: Uint8Array, v: v50.RegistrarInfo][]>
    getPairsPaged(pageSize: number): AsyncIterable<[k: Uint8Array, v: v50.RegistrarInfo][]>
    getPairsPaged(pageSize: number, key: Uint8Array): AsyncIterable<[k: Uint8Array, v: v50.RegistrarInfo][]>
}

export class WorkerNodePalletRewardPeriodLengthStorage extends StorageBase {
    protected getPrefix() {
        return 'WorkerNodePallet'
    }

    protected getName() {
        return 'RewardPeriodLength'
    }

    get isV50(): boolean {
        return this.getTypeHash() === '81bbbe8e62451cbcc227306706c919527aa2538970bd6d67a9969dd52c257d02'
    }

    get asV50(): WorkerNodePalletRewardPeriodLengthStorageV50 {
        assert(this.isV50)
        return this as any
    }
}

export interface WorkerNodePalletRewardPeriodLengthStorageV50 {
    get(): Promise<number>
}

export class WorkerNodePalletSolutionGroupCalculatedRewardsStorage extends StorageBase {
    protected getPrefix() {
        return 'WorkerNodePallet'
    }

    protected getName() {
        return 'SolutionGroupCalculatedRewards'
    }

    get isV56(): boolean {
        return this.getTypeHash() === 'be0a927f7e8e94013201f553700d2fca8f0af94854f36d99eef5d5a06dfbf2ab'
    }

    get asV56(): WorkerNodePalletSolutionGroupCalculatedRewardsStorageV56 {
        assert(this.isV56)
        return this as any
    }
}

export interface WorkerNodePalletSolutionGroupCalculatedRewardsStorageV56 {
    get(key: Uint8Array): Promise<[bigint, bigint]>
    getAll(): Promise<[bigint, bigint][]>
    getMany(keys: Uint8Array[]): Promise<[bigint, bigint][]>
    getKeys(): Promise<Uint8Array[]>
    getKeys(key: Uint8Array): Promise<Uint8Array[]>
    getKeysPaged(pageSize: number): AsyncIterable<Uint8Array[]>
    getKeysPaged(pageSize: number, key: Uint8Array): AsyncIterable<Uint8Array[]>
    getPairs(): Promise<[k: Uint8Array, v: [bigint, bigint]][]>
    getPairs(key: Uint8Array): Promise<[k: Uint8Array, v: [bigint, bigint]][]>
    getPairsPaged(pageSize: number): AsyncIterable<[k: Uint8Array, v: [bigint, bigint]][]>
    getPairsPaged(pageSize: number, key: Uint8Array): AsyncIterable<[k: Uint8Array, v: [bigint, bigint]][]>
}

export class WorkerNodePalletSolutionGroupRewardPeriodConfigStorage extends StorageBase {
    protected getPrefix() {
        return 'WorkerNodePallet'
    }

    protected getName() {
        return 'SolutionGroupRewardPeriodConfig'
    }

    /**
     *  Solution group historic data on reward periods that will be used for rewards calculation
     */
    get isV50(): boolean {
        return this.getTypeHash() === '6128d350ed6eb568b984464280ba624cc0830765ed77cf453325eadcdeeedbf1'
    }

    /**
     *  Solution group historic data on reward periods that will be used for rewards calculation
     */
    get asV50(): WorkerNodePalletSolutionGroupRewardPeriodConfigStorageV50 {
        assert(this.isV50)
        return this as any
    }
}

/**
 *  Solution group historic data on reward periods that will be used for rewards calculation
 */
export interface WorkerNodePalletSolutionGroupRewardPeriodConfigStorageV50 {
    get(key1: number, key2: Uint8Array): Promise<(v50.SolutionGroupRewardData | undefined)>
    getAll(): Promise<v50.SolutionGroupRewardData[]>
    getMany(keys: [number, Uint8Array][]): Promise<(v50.SolutionGroupRewardData | undefined)[]>
    getKeys(): Promise<[number, Uint8Array][]>
    getKeys(key1: number): Promise<[number, Uint8Array][]>
    getKeys(key1: number, key2: Uint8Array): Promise<[number, Uint8Array][]>
    getKeysPaged(pageSize: number): AsyncIterable<[number, Uint8Array][]>
    getKeysPaged(pageSize: number, key1: number): AsyncIterable<[number, Uint8Array][]>
    getKeysPaged(pageSize: number, key1: number, key2: Uint8Array): AsyncIterable<[number, Uint8Array][]>
    getPairs(): Promise<[k: [number, Uint8Array], v: v50.SolutionGroupRewardData][]>
    getPairs(key1: number): Promise<[k: [number, Uint8Array], v: v50.SolutionGroupRewardData][]>
    getPairs(key1: number, key2: Uint8Array): Promise<[k: [number, Uint8Array], v: v50.SolutionGroupRewardData][]>
    getPairsPaged(pageSize: number): AsyncIterable<[k: [number, Uint8Array], v: v50.SolutionGroupRewardData][]>
    getPairsPaged(pageSize: number, key1: number): AsyncIterable<[k: [number, Uint8Array], v: v50.SolutionGroupRewardData][]>
    getPairsPaged(pageSize: number, key1: number, key2: Uint8Array): AsyncIterable<[k: [number, Uint8Array], v: v50.SolutionGroupRewardData][]>
}

export class WorkerNodePalletSolutionGroupStakeRecordsStorage extends StorageBase {
    protected getPrefix() {
        return 'WorkerNodePallet'
    }

    protected getName() {
        return 'SolutionGroupStakeRecords'
    }

    /**
     *  Registry of all subscriptions from all namespaces
     */
    get isV56(): boolean {
        return this.getTypeHash() === 'c178f0cefe2bb9b203515d1ebac26a725a5fcf49df9cf98f730cf1969dff40f4'
    }

    /**
     *  Registry of all subscriptions from all namespaces
     */
    get asV56(): WorkerNodePalletSolutionGroupStakeRecordsStorageV56 {
        assert(this.isV56)
        return this as any
    }
}

/**
 *  Registry of all subscriptions from all namespaces
 */
export interface WorkerNodePalletSolutionGroupStakeRecordsStorageV56 {
    get(key1: Uint8Array, key2: Uint8Array): Promise<([number, bigint][] | undefined)>
    getAll(): Promise<[number, bigint][][]>
    getMany(keys: [Uint8Array, Uint8Array][]): Promise<([number, bigint][] | undefined)[]>
    getKeys(): Promise<[Uint8Array, Uint8Array][]>
    getKeys(key1: Uint8Array): Promise<[Uint8Array, Uint8Array][]>
    getKeys(key1: Uint8Array, key2: Uint8Array): Promise<[Uint8Array, Uint8Array][]>
    getKeysPaged(pageSize: number): AsyncIterable<[Uint8Array, Uint8Array][]>
    getKeysPaged(pageSize: number, key1: Uint8Array): AsyncIterable<[Uint8Array, Uint8Array][]>
    getKeysPaged(pageSize: number, key1: Uint8Array, key2: Uint8Array): AsyncIterable<[Uint8Array, Uint8Array][]>
    getPairs(): Promise<[k: [Uint8Array, Uint8Array], v: [number, bigint][]][]>
    getPairs(key1: Uint8Array): Promise<[k: [Uint8Array, Uint8Array], v: [number, bigint][]][]>
    getPairs(key1: Uint8Array, key2: Uint8Array): Promise<[k: [Uint8Array, Uint8Array], v: [number, bigint][]][]>
    getPairsPaged(pageSize: number): AsyncIterable<[k: [Uint8Array, Uint8Array], v: [number, bigint][]][]>
    getPairsPaged(pageSize: number, key1: Uint8Array): AsyncIterable<[k: [Uint8Array, Uint8Array], v: [number, bigint][]][]>
    getPairsPaged(pageSize: number, key1: Uint8Array, key2: Uint8Array): AsyncIterable<[k: [Uint8Array, Uint8Array], v: [number, bigint][]][]>
}

export class WorkerNodePalletSolutionGroupSubscribersCountStorage extends StorageBase {
    protected getPrefix() {
        return 'WorkerNodePallet'
    }

    protected getName() {
        return 'SolutionGroupSubscribersCount'
    }

    get isV50(): boolean {
        return this.getTypeHash() === '512d66d27663ed4b2b3d491cca949fbc84b5b02d7a34f4a4102203eb5f83d518'
    }

    get asV50(): WorkerNodePalletSolutionGroupSubscribersCountStorageV50 {
        assert(this.isV50)
        return this as any
    }
}

export interface WorkerNodePalletSolutionGroupSubscribersCountStorageV50 {
    get(key: Uint8Array): Promise<number>
    getAll(): Promise<number[]>
    getMany(keys: Uint8Array[]): Promise<number[]>
    getKeys(): Promise<Uint8Array[]>
    getKeys(key: Uint8Array): Promise<Uint8Array[]>
    getKeysPaged(pageSize: number): AsyncIterable<Uint8Array[]>
    getKeysPaged(pageSize: number, key: Uint8Array): AsyncIterable<Uint8Array[]>
    getPairs(): Promise<[k: Uint8Array, v: number][]>
    getPairs(key: Uint8Array): Promise<[k: Uint8Array, v: number][]>
    getPairsPaged(pageSize: number): AsyncIterable<[k: Uint8Array, v: number][]>
    getPairsPaged(pageSize: number, key: Uint8Array): AsyncIterable<[k: Uint8Array, v: number][]>
}

export class WorkerNodePalletSolutionGroupSubscriptionRegistryStorage extends StorageBase {
    protected getPrefix() {
        return 'WorkerNodePallet'
    }

    protected getName() {
        return 'SolutionGroupSubscriptionRegistry'
    }

    /**
     *  Registry of all subscriptions from all namespaces
     *  Conventions:
     *  - The keys values and stakes from completed reward periods should never mutate till they get
     *    pruned.
     *  - Map entries from current reward period should never be deleted, as they are used to
     *    populate the subscriptions of the next reward period. The stake value can be updated as
     *    needed.
     */
    get isV50(): boolean {
        return this.getTypeHash() === 'c9c682cfa00d9717f4e648ad7f502a531ce38c84ca7aec8338ad8fc189810ce7'
    }

    /**
     *  Registry of all subscriptions from all namespaces
     *  Conventions:
     *  - The keys values and stakes from completed reward periods should never mutate till they get
     *    pruned.
     *  - Map entries from current reward period should never be deleted, as they are used to
     *    populate the subscriptions of the next reward period. The stake value can be updated as
     *    needed.
     */
    get asV50(): WorkerNodePalletSolutionGroupSubscriptionRegistryStorageV50 {
        assert(this.isV50)
        return this as any
    }
}

/**
 *  Registry of all subscriptions from all namespaces
 *  Conventions:
 *  - The keys values and stakes from completed reward periods should never mutate till they get
 *    pruned.
 *  - Map entries from current reward period should never be deleted, as they are used to
 *    populate the subscriptions of the next reward period. The stake value can be updated as
 *    needed.
 */
export interface WorkerNodePalletSolutionGroupSubscriptionRegistryStorageV50 {
    get(key1: number, key2: [Uint8Array, Uint8Array]): Promise<(bigint | undefined)>
    getAll(): Promise<bigint[]>
    getMany(keys: [number, [Uint8Array, Uint8Array]][]): Promise<(bigint | undefined)[]>
    getKeys(): Promise<[number, [Uint8Array, Uint8Array]][]>
    getKeys(key1: number): Promise<[number, [Uint8Array, Uint8Array]][]>
    getKeys(key1: number, key2: [Uint8Array, Uint8Array]): Promise<[number, [Uint8Array, Uint8Array]][]>
    getKeysPaged(pageSize: number): AsyncIterable<[number, [Uint8Array, Uint8Array]][]>
    getKeysPaged(pageSize: number, key1: number): AsyncIterable<[number, [Uint8Array, Uint8Array]][]>
    getKeysPaged(pageSize: number, key1: number, key2: [Uint8Array, Uint8Array]): AsyncIterable<[number, [Uint8Array, Uint8Array]][]>
    getPairs(): Promise<[k: [number, [Uint8Array, Uint8Array]], v: bigint][]>
    getPairs(key1: number): Promise<[k: [number, [Uint8Array, Uint8Array]], v: bigint][]>
    getPairs(key1: number, key2: [Uint8Array, Uint8Array]): Promise<[k: [number, [Uint8Array, Uint8Array]], v: bigint][]>
    getPairsPaged(pageSize: number): AsyncIterable<[k: [number, [Uint8Array, Uint8Array]], v: bigint][]>
    getPairsPaged(pageSize: number, key1: number): AsyncIterable<[k: [number, [Uint8Array, Uint8Array]], v: bigint][]>
    getPairsPaged(pageSize: number, key1: number, key2: [Uint8Array, Uint8Array]): AsyncIterable<[k: [number, [Uint8Array, Uint8Array]], v: bigint][]>
}

export class WorkerNodePalletSolutionResultsStorage extends StorageBase {
    protected getPrefix() {
        return 'WorkerNodePallet'
    }

    protected getName() {
        return 'SolutionResults'
    }

    get isV50(): boolean {
        return this.getTypeHash() === '4e84b62a82d81527fc15fb1ffbd832e586dcdffef8b897b0d94faf144ac694e9'
    }

    get asV50(): WorkerNodePalletSolutionResultsStorageV50 {
        assert(this.isV50)
        return this as any
    }
}

export interface WorkerNodePalletSolutionResultsStorageV50 {
    get(key1: Uint8Array, key2: Uint8Array, key3: Uint8Array): Promise<(Uint8Array | undefined)>
    getAll(): Promise<Uint8Array[]>
    getMany(keys: [Uint8Array, Uint8Array, Uint8Array][]): Promise<(Uint8Array | undefined)[]>
    getKeys(): Promise<[Uint8Array, Uint8Array, Uint8Array][]>
    getKeys(key1: Uint8Array): Promise<[Uint8Array, Uint8Array, Uint8Array][]>
    getKeys(key1: Uint8Array, key2: Uint8Array): Promise<[Uint8Array, Uint8Array, Uint8Array][]>
    getKeys(key1: Uint8Array, key2: Uint8Array, key3: Uint8Array): Promise<[Uint8Array, Uint8Array, Uint8Array][]>
    getKeysPaged(pageSize: number): AsyncIterable<[Uint8Array, Uint8Array, Uint8Array][]>
    getKeysPaged(pageSize: number, key1: Uint8Array): AsyncIterable<[Uint8Array, Uint8Array, Uint8Array][]>
    getKeysPaged(pageSize: number, key1: Uint8Array, key2: Uint8Array): AsyncIterable<[Uint8Array, Uint8Array, Uint8Array][]>
    getKeysPaged(pageSize: number, key1: Uint8Array, key2: Uint8Array, key3: Uint8Array): AsyncIterable<[Uint8Array, Uint8Array, Uint8Array][]>
    getPairs(): Promise<[k: [Uint8Array, Uint8Array, Uint8Array], v: Uint8Array][]>
    getPairs(key1: Uint8Array): Promise<[k: [Uint8Array, Uint8Array, Uint8Array], v: Uint8Array][]>
    getPairs(key1: Uint8Array, key2: Uint8Array): Promise<[k: [Uint8Array, Uint8Array, Uint8Array], v: Uint8Array][]>
    getPairs(key1: Uint8Array, key2: Uint8Array, key3: Uint8Array): Promise<[k: [Uint8Array, Uint8Array, Uint8Array], v: Uint8Array][]>
    getPairsPaged(pageSize: number): AsyncIterable<[k: [Uint8Array, Uint8Array, Uint8Array], v: Uint8Array][]>
    getPairsPaged(pageSize: number, key1: Uint8Array): AsyncIterable<[k: [Uint8Array, Uint8Array, Uint8Array], v: Uint8Array][]>
    getPairsPaged(pageSize: number, key1: Uint8Array, key2: Uint8Array): AsyncIterable<[k: [Uint8Array, Uint8Array, Uint8Array], v: Uint8Array][]>
    getPairsPaged(pageSize: number, key1: Uint8Array, key2: Uint8Array, key3: Uint8Array): AsyncIterable<[k: [Uint8Array, Uint8Array, Uint8Array], v: Uint8Array][]>
}

export class WorkerNodePalletSolutionsStorage extends StorageBase {
    protected getPrefix() {
        return 'WorkerNodePallet'
    }

    protected getName() {
        return 'Solutions'
    }

    get isV50(): boolean {
        return this.getTypeHash() === '58987729c0f045791bd637225bd9362ddc62fc91ef40ec2db59d1fa3334c4039'
    }

    get asV50(): WorkerNodePalletSolutionsStorageV50 {
        assert(this.isV50)
        return this as any
    }

    get isV56(): boolean {
        return this.getTypeHash() === '8f530136c5040b217778aeaa9ac0b3c49fb2c23c579fe16992c29bb3ad3deb5d'
    }

    get asV56(): WorkerNodePalletSolutionsStorageV56 {
        assert(this.isV56)
        return this as any
    }
}

export interface WorkerNodePalletSolutionsStorageV50 {
    get(key: Uint8Array): Promise<(v50.Solution | undefined)>
    getAll(): Promise<v50.Solution[]>
    getMany(keys: Uint8Array[]): Promise<(v50.Solution | undefined)[]>
    getKeys(): Promise<Uint8Array[]>
    getKeys(key: Uint8Array): Promise<Uint8Array[]>
    getKeysPaged(pageSize: number): AsyncIterable<Uint8Array[]>
    getKeysPaged(pageSize: number, key: Uint8Array): AsyncIterable<Uint8Array[]>
    getPairs(): Promise<[k: Uint8Array, v: v50.Solution][]>
    getPairs(key: Uint8Array): Promise<[k: Uint8Array, v: v50.Solution][]>
    getPairsPaged(pageSize: number): AsyncIterable<[k: Uint8Array, v: v50.Solution][]>
    getPairsPaged(pageSize: number, key: Uint8Array): AsyncIterable<[k: Uint8Array, v: v50.Solution][]>
}

export interface WorkerNodePalletSolutionsStorageV56 {
    get(key: Uint8Array): Promise<(v56.Solution | undefined)>
    getAll(): Promise<v56.Solution[]>
    getMany(keys: Uint8Array[]): Promise<(v56.Solution | undefined)[]>
    getKeys(): Promise<Uint8Array[]>
    getKeys(key: Uint8Array): Promise<Uint8Array[]>
    getKeysPaged(pageSize: number): AsyncIterable<Uint8Array[]>
    getKeysPaged(pageSize: number, key: Uint8Array): AsyncIterable<Uint8Array[]>
    getPairs(): Promise<[k: Uint8Array, v: v56.Solution][]>
    getPairs(key: Uint8Array): Promise<[k: Uint8Array, v: v56.Solution][]>
    getPairsPaged(pageSize: number): AsyncIterable<[k: Uint8Array, v: v56.Solution][]>
    getPairsPaged(pageSize: number, key: Uint8Array): AsyncIterable<[k: Uint8Array, v: v56.Solution][]>
}

export class WorkerNodePalletSolutionsGroupsStorage extends StorageBase {
    protected getPrefix() {
        return 'WorkerNodePallet'
    }

    protected getName() {
        return 'SolutionsGroups'
    }

    get isV50(): boolean {
        return this.getTypeHash() === 'b3cfa0075db640ba1503ee81eb6b20379f4b069ca2d5000009af9a491f7e5658'
    }

    get asV50(): WorkerNodePalletSolutionsGroupsStorageV50 {
        assert(this.isV50)
        return this as any
    }
}

export interface WorkerNodePalletSolutionsGroupsStorageV50 {
    get(key: Uint8Array): Promise<(v50.SolutionGroup | undefined)>
    getAll(): Promise<v50.SolutionGroup[]>
    getMany(keys: Uint8Array[]): Promise<(v50.SolutionGroup | undefined)[]>
    getKeys(): Promise<Uint8Array[]>
    getKeys(key: Uint8Array): Promise<Uint8Array[]>
    getKeysPaged(pageSize: number): AsyncIterable<Uint8Array[]>
    getKeysPaged(pageSize: number, key: Uint8Array): AsyncIterable<Uint8Array[]>
    getPairs(): Promise<[k: Uint8Array, v: v50.SolutionGroup][]>
    getPairs(key: Uint8Array): Promise<[k: Uint8Array, v: v50.SolutionGroup][]>
    getPairsPaged(pageSize: number): AsyncIterable<[k: Uint8Array, v: v50.SolutionGroup][]>
    getPairsPaged(pageSize: number, key: Uint8Array): AsyncIterable<[k: Uint8Array, v: v50.SolutionGroup][]>
}

export class WorkerNodePalletSubmissionsQuotaStorage extends StorageBase {
    protected getPrefix() {
        return 'WorkerNodePallet'
    }

    protected getName() {
        return 'SubmissionsQuota'
    }

    /**
     *  Number of allowed submissions within subscription per reward period
     */
    get isV50(): boolean {
        return this.getTypeHash() === '95ff4f914f08e149ddbe1ae2dcb1743bbf9aaae69d04c486e1a398cacfcca06a'
    }

    /**
     *  Number of allowed submissions within subscription per reward period
     */
    get asV50(): WorkerNodePalletSubmissionsQuotaStorageV50 {
        assert(this.isV50)
        return this as any
    }
}

/**
 *  Number of allowed submissions within subscription per reward period
 */
export interface WorkerNodePalletSubmissionsQuotaStorageV50 {
    get(): Promise<bigint>
}

export class WorkerNodePalletWorkerNodeOperatorDepositStorage extends StorageBase {
    protected getPrefix() {
        return 'WorkerNodePallet'
    }

    protected getName() {
        return 'WorkerNodeOperatorDeposit'
    }

    get isV50(): boolean {
        return this.getTypeHash() === 'f8ebe28eb30158172c0ccf672f7747c46a244f892d08ef2ebcbaadde34a26bc0'
    }

    get asV50(): WorkerNodePalletWorkerNodeOperatorDepositStorageV50 {
        assert(this.isV50)
        return this as any
    }
}

export interface WorkerNodePalletWorkerNodeOperatorDepositStorageV50 {
    get(): Promise<bigint>
}

export class WorkerNodePalletWorkerNodeOperatorInventoryStorage extends StorageBase {
    protected getPrefix() {
        return 'WorkerNodePallet'
    }

    protected getName() {
        return 'WorkerNodeOperatorInventory'
    }

    get isV50(): boolean {
        return this.getTypeHash() === '73a73f39f6c206a3b43b701c13e87fd13264792b445e32964d486032028553c4'
    }

    get asV50(): WorkerNodePalletWorkerNodeOperatorInventoryStorageV50 {
        assert(this.isV50)
        return this as any
    }
}

export interface WorkerNodePalletWorkerNodeOperatorInventoryStorageV50 {
    get(key: Uint8Array): Promise<(v50.WorkerNodeOperatorInfo | undefined)>
    getAll(): Promise<v50.WorkerNodeOperatorInfo[]>
    getMany(keys: Uint8Array[]): Promise<(v50.WorkerNodeOperatorInfo | undefined)[]>
    getKeys(): Promise<Uint8Array[]>
    getKeys(key: Uint8Array): Promise<Uint8Array[]>
    getKeysPaged(pageSize: number): AsyncIterable<Uint8Array[]>
    getKeysPaged(pageSize: number, key: Uint8Array): AsyncIterable<Uint8Array[]>
    getPairs(): Promise<[k: Uint8Array, v: v50.WorkerNodeOperatorInfo][]>
    getPairs(key: Uint8Array): Promise<[k: Uint8Array, v: v50.WorkerNodeOperatorInfo][]>
    getPairsPaged(pageSize: number): AsyncIterable<[k: Uint8Array, v: v50.WorkerNodeOperatorInfo][]>
    getPairsPaged(pageSize: number, key: Uint8Array): AsyncIterable<[k: Uint8Array, v: v50.WorkerNodeOperatorInfo][]>
}

export class WorkerNodePalletWorkerNodeToOperatorStorage extends StorageBase {
    protected getPrefix() {
        return 'WorkerNodePallet'
    }

    protected getName() {
        return 'WorkerNodeToOperator'
    }

    get isV50(): boolean {
        return this.getTypeHash() === 'de3ac6d702494f77c04d74bab1d59ac44113746a3722fe8b7306730fb0fc740c'
    }

    get asV50(): WorkerNodePalletWorkerNodeToOperatorStorageV50 {
        assert(this.isV50)
        return this as any
    }
}

export interface WorkerNodePalletWorkerNodeToOperatorStorageV50 {
    get(key: Uint8Array): Promise<(Uint8Array | undefined)>
    getAll(): Promise<Uint8Array[]>
    getMany(keys: Uint8Array[]): Promise<(Uint8Array | undefined)[]>
    getKeys(): Promise<Uint8Array[]>
    getKeys(key: Uint8Array): Promise<Uint8Array[]>
    getKeysPaged(pageSize: number): AsyncIterable<Uint8Array[]>
    getKeysPaged(pageSize: number, key: Uint8Array): AsyncIterable<Uint8Array[]>
    getPairs(): Promise<[k: Uint8Array, v: Uint8Array][]>
    getPairs(key: Uint8Array): Promise<[k: Uint8Array, v: Uint8Array][]>
    getPairsPaged(pageSize: number): AsyncIterable<[k: Uint8Array, v: Uint8Array][]>
    getPairsPaged(pageSize: number, key: Uint8Array): AsyncIterable<[k: Uint8Array, v: Uint8Array][]>
}
