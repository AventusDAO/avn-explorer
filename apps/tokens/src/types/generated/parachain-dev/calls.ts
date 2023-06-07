import assert from 'assert'
import {Chain, ChainContext, CallContext, Call, Result, Option} from './support'

export class MigrationMigrateTokenManagerBalancesCall {
    private readonly _chain: Chain
    private readonly call: Call

    constructor(ctx: CallContext)
    constructor(ctx: ChainContext, call: Call)
    constructor(ctx: CallContext, call?: Call) {
        call = call || ctx.call
        assert(call.name === 'Migration.migrate_token_manager_balances')
        this._chain = ctx._chain
        this.call = call
    }

    get isV21(): boolean {
        return this._chain.getCallHash('Migration.migrate_token_manager_balances') === 'd7b777ff90bf7db9af6f0f059bc50152606046c20f1c27a1c0a8771f571b68e9'
    }

    get asV21(): {tokenAccountPairs: [Uint8Array, bigint][]} {
        assert(this.isV21)
        return this._chain.decodeCall(this.call)
    }
}
