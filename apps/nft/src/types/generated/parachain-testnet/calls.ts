import assert from 'assert'
import {Chain, ChainContext, CallContext, Call, Result, Option} from './support'

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
    get isV12(): boolean {
        return this._chain.getCallHash('Migration.migrate_nfts') === '5b0cdacc742b2fc3541017ac980a9633646efd74e9f2c9752171948886d9abac'
    }

    /**
     * Migrates NftManager Nfts from the AvN source chain
     */
    get asV12(): {nfts: [Uint8Array, Uint8Array][]} {
        assert(this.isV12)
        return this._chain.decodeCall(this.call)
    }
}
