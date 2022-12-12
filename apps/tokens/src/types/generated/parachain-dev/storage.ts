import assert from 'assert'
import {Block, Chain, ChainContext, BlockContext, Result, Option} from './support'

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
