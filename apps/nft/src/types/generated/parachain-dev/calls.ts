import assert from 'assert'
import {Chain, ChainContext, CallContext, Call, Result, Option} from './support'

export class MigrationMigrateBatchInfoIdsCall {
    private readonly _chain: Chain
    private readonly call: Call

    constructor(ctx: CallContext)
    constructor(ctx: ChainContext, call: Call)
    constructor(ctx: CallContext, call?: Call) {
        call = call || ctx.call
        assert(call.name === 'Migration.migrate_batch_info_ids')
        this._chain = ctx._chain
        this.call = call
    }

    /**
     * Migrates NftManager Nft Batch InfoIds from the AvN source chain
     */
    get isV21(): boolean {
        return this._chain.getCallHash('Migration.migrate_batch_info_ids') === 'bb001fdf20a695f3672c2f97617f4530637ebbbe276c877a41305bb8848b77e2'
    }

    /**
     * Migrates NftManager Nft Batch InfoIds from the AvN source chain
     */
    get asV21(): {infoIds: [Uint8Array, bigint][]} {
        assert(this.isV21)
        return this._chain.decodeCall(this.call)
    }
}

export class MigrationMigrateBatchNoncesCall {
    private readonly _chain: Chain
    private readonly call: Call

    constructor(ctx: CallContext)
    constructor(ctx: ChainContext, call: Call)
    constructor(ctx: CallContext, call?: Call) {
        call = call || ctx.call
        assert(call.name === 'Migration.migrate_batch_nonces')
        this._chain = ctx._chain
        this.call = call
    }

    /**
     * Migrates NftManager Nft Batch Nonces from the AvN source chain
     */
    get isV21(): boolean {
        return this._chain.getCallHash('Migration.migrate_batch_nonces') === '3b7d8303d90a5274938396d2994c20016ab0084d29768b191a9dfce68dfb6e1a'
    }

    /**
     * Migrates NftManager Nft Batch Nonces from the AvN source chain
     */
    get asV21(): {nonces: [Uint8Array, bigint][]} {
        assert(this.isV21)
        return this._chain.decodeCall(this.call)
    }
}

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

export class MigrationMigrateNftInfosCall {
    private readonly _chain: Chain
    private readonly call: Call

    constructor(ctx: CallContext)
    constructor(ctx: ChainContext, call: Call)
    constructor(ctx: CallContext, call?: Call) {
        call = call || ctx.call
        assert(call.name === 'Migration.migrate_nft_infos')
        this._chain = ctx._chain
        this.call = call
    }

    /**
     * Migrates NftManager NftInfos from the AvN source chain
     */
    get isV21(): boolean {
        return this._chain.getCallHash('Migration.migrate_nft_infos') === '7b646c0e0cd1b17309d284a54286a87248f44b798176a4edc399e35f439ec747'
    }

    /**
     * Migrates NftManager NftInfos from the AvN source chain
     */
    get asV21(): {infos: [Uint8Array, Uint8Array][]} {
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
