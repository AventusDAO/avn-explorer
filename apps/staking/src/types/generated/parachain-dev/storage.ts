import assert from 'assert'
import {Block, Chain, ChainContext, BlockContext, Result, Option} from './support'
import * as v21 from './v21'

export class ParachainStakingNominatorStateStorage {
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
     *  Get nominator state associated with an account if account is nominating else None
     */
    get isV21() {
        return this._chain.getStorageItemTypeHash('ParachainStaking', 'NominatorState') === '1c202ee2b387e76b12a61cfe4a3f557431cd1902af95841b0b3ee6ab3747befe'
    }

    /**
     *  Get nominator state associated with an account if account is nominating else None
     */
    async getAsV21(key: Uint8Array): Promise<v21.Nominator | undefined> {
        assert(this.isV21)
        return this._chain.getStorage(this.blockHash, 'ParachainStaking', 'NominatorState', key)
    }

    async getManyAsV21(keys: Uint8Array[]): Promise<(v21.Nominator | undefined)[]> {
        assert(this.isV21)
        return this._chain.queryStorage(this.blockHash, 'ParachainStaking', 'NominatorState', keys.map(k => [k]))
    }

    async getAllAsV21(): Promise<(v21.Nominator)[]> {
        assert(this.isV21)
        return this._chain.queryStorage(this.blockHash, 'ParachainStaking', 'NominatorState')
    }

    /**
     * Checks whether the storage item is defined for the current chain version.
     */
    get isExists(): boolean {
        return this._chain.getStorageItemTypeHash('ParachainStaking', 'NominatorState') != null
    }
}
