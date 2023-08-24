import assert from 'assert'
import {Chain, ChainContext, CallContext, Call, Result, Option} from './support'

export class MigrationMigrateNftBatchesCall {
    private readonly _chain: Chain
    private readonly call: Call

    constructor(ctx: CallContext)
    constructor(ctx: ChainContext, call: Call)
    constructor(ctx: CallContext, call?: Call) {
        call = call || ctx.call
        assert(call.name === 'Migration.migrate_nft_batches')
        this._chain = ctx._chain
        this.call = call
    }

    /**
     * Migrates NftManager Nft Batches from the AvN source chain
     */
    get isV21(): boolean {
        return this._chain.getCallHash('Migration.migrate_nft_batches') === 'd0f69b37cceb9b2e5b2cf910869bd696509e55e943aeb4b45037497449482869'
    }

    /**
     * Migrates NftManager Nft Batches from the AvN source chain
     */
    get asV21(): {batches: [Uint8Array, Uint8Array][]} {
        assert(this.isV21)
        return this._chain.decodeCall(this.call)
    }
}

export class MigrationMigrateNftsCall {
    private readonly _chain: Chain
    private readonly call: Call

    constructor(ctx: CallContext)
    constructor(ctx: ChainContext, call: Call)
    constructor(ctx: CallContext, call?: Call) {
        call = call || ctx.call
        assert(call.name === 'Migration.migrate_nfts')
        this._chain = ctx._chain
        this.call = call
    }

    /**
     * Migrates NftManager Nfts from the AvN source chain
     */
    get isV21(): boolean {
        return this._chain.getCallHash('Migration.migrate_nfts') === '5b0cdacc742b2fc3541017ac980a9633646efd74e9f2c9752171948886d9abac'
    }

    /**
     * Migrates NftManager Nfts from the AvN source chain
     */
    get asV21(): {nfts: [Uint8Array, Uint8Array][]} {
        assert(this.isV21)
        return this._chain.decodeCall(this.call)
    }
}
