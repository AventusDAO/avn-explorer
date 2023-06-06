import assert from 'assert'
import {Chain, ChainContext, CallContext, Call, Result, Option} from './support'

export class MigrationMigrateSystemAccountCall {
    private readonly _chain: Chain
    private readonly call: Call

    constructor(ctx: CallContext)
    constructor(ctx: ChainContext, call: Call)
    constructor(ctx: CallContext, call?: Call) {
        call = call || ctx.call
        assert(call.name === 'Migration.migrate_system_account')
        this._chain = ctx._chain
        this.call = call
    }

    /**
     * Migrating the Account informations from frame_system.
     * 
     * This call takes the raw scale encoded key (= patricia-key for each account in the `Account` storage and inserts
     * the provided scale encoded value (= `AccountInfo`) into the underlying DB.
     * 
     * Note: As we are converting from substrate-v2 to substrate-v3 we must do type-conversions. Those conversions are done
     * off-chain.
     */
    get isV21(): boolean {
        return this._chain.getCallHash('Migration.migrate_system_account') === '8f752997770c549f5b2110f1fefa80bf1ce3e4cfb892e26a4d0ccb769acf1202'
    }

    /**
     * Migrating the Account informations from frame_system.
     * 
     * This call takes the raw scale encoded key (= patricia-key for each account in the `Account` storage and inserts
     * the provided scale encoded value (= `AccountInfo`) into the underlying DB.
     * 
     * Note: As we are converting from substrate-v2 to substrate-v3 we must do type-conversions. Those conversions are done
     * off-chain.
     */
    get asV21(): {accounts: [Uint8Array, Uint8Array][]} {
        assert(this.isV21)
        return this._chain.decodeCall(this.call)
    }
}
