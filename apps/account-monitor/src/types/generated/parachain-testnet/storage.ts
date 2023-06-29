import assert from 'assert'
import {Block, Chain, ChainContext, BlockContext, Result, Option} from './support'
import * as v4 from './v4'

export class BalancesAccountStorage {
    private readonly _chain: Chain
    private readonly blockHash: string

    constructor(ctx: BlockContext)
    constructor(ctx: ChainContext, block: Block)
    constructor(ctx: BlockContext, block?: Block) {
        block = block || ctx.block
        this.blockHash = block.hash
        this._chain = ctx._chain
    }

    /**
     *  The Balances pallet example of storing the balance of an account.
     * 
     *  # Example
     * 
     *  ```nocompile
     *   impl pallet_balances::Config for Runtime {
     *     type AccountStore = StorageMapShim<Self::Account<Runtime>, frame_system::Provider<Runtime>, AccountId, Self::AccountData<Balance>>
     *   }
     *  ```
     * 
     *  You can also store the balance of an account in the `System` pallet.
     * 
     *  # Example
     * 
     *  ```nocompile
     *   impl pallet_balances::Config for Runtime {
     *    type AccountStore = System
     *   }
     *  ```
     * 
     *  But this comes with tradeoffs, storing account balances in the system pallet stores
     *  `frame_system` data alongside the account data contrary to storing account balances in the
     *  `Balances` pallet, which uses a `StorageMap` to store balances data only.
     *  NOTE: This is only used in the case that this pallet is used to store balances.
     */
    get isV4() {
        return this._chain.getStorageItemTypeHash('Balances', 'Account') === '0b3b4bf0dd7388459eba461bc7c3226bf58608c941710a714e02f33ec0f91e78'
    }

    /**
     *  The Balances pallet example of storing the balance of an account.
     * 
     *  # Example
     * 
     *  ```nocompile
     *   impl pallet_balances::Config for Runtime {
     *     type AccountStore = StorageMapShim<Self::Account<Runtime>, frame_system::Provider<Runtime>, AccountId, Self::AccountData<Balance>>
     *   }
     *  ```
     * 
     *  You can also store the balance of an account in the `System` pallet.
     * 
     *  # Example
     * 
     *  ```nocompile
     *   impl pallet_balances::Config for Runtime {
     *    type AccountStore = System
     *   }
     *  ```
     * 
     *  But this comes with tradeoffs, storing account balances in the system pallet stores
     *  `frame_system` data alongside the account data contrary to storing account balances in the
     *  `Balances` pallet, which uses a `StorageMap` to store balances data only.
     *  NOTE: This is only used in the case that this pallet is used to store balances.
     */
    async getAsV4(key: Uint8Array): Promise<v4.AccountData> {
        assert(this.isV4)
        return this._chain.getStorage(this.blockHash, 'Balances', 'Account', key)
    }

    async getManyAsV4(keys: Uint8Array[]): Promise<(v4.AccountData)[]> {
        assert(this.isV4)
        return this._chain.queryStorage(this.blockHash, 'Balances', 'Account', keys.map(k => [k]))
    }

    async getAllAsV4(): Promise<(v4.AccountData)[]> {
        assert(this.isV4)
        return this._chain.queryStorage(this.blockHash, 'Balances', 'Account')
    }

    /**
     * Checks whether the storage item is defined for the current chain version.
     */
    get isExists(): boolean {
        return this._chain.getStorageItemTypeHash('Balances', 'Account') != null
    }
}

export class TokenManagerBalancesStorage {
    private readonly _chain: Chain
    private readonly blockHash: string

    constructor(ctx: BlockContext)
    constructor(ctx: ChainContext, block: Block)
    constructor(ctx: BlockContext, block?: Block) {
        block = block || ctx.block
        this.blockHash = block.hash
        this._chain = ctx._chain
    }

    /**
     *  The number of units of tokens held by any given account.
     */
    get isV4() {
        return this._chain.getStorageItemTypeHash('TokenManager', 'Balances') === '70874cd5f158184b9b398819cb71b85684c5adb4e5cc9e1065d1115dac23d5f2'
    }

    /**
     *  The number of units of tokens held by any given account.
     */
    async getAsV4(key: [Uint8Array, Uint8Array]): Promise<bigint> {
        assert(this.isV4)
        return this._chain.getStorage(this.blockHash, 'TokenManager', 'Balances', key)
    }

    async getManyAsV4(keys: [Uint8Array, Uint8Array][]): Promise<(bigint)[]> {
        assert(this.isV4)
        return this._chain.queryStorage(this.blockHash, 'TokenManager', 'Balances', keys.map(k => [k]))
    }

    async getAllAsV4(): Promise<(bigint)[]> {
        assert(this.isV4)
        return this._chain.queryStorage(this.blockHash, 'TokenManager', 'Balances')
    }

    /**
     * Checks whether the storage item is defined for the current chain version.
     */
    get isExists(): boolean {
        return this._chain.getStorageItemTypeHash('TokenManager', 'Balances') != null
    }
}
