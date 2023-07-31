import assert from 'assert'
import {Chain, ChainContext, EventContext, Event, Result, Option} from './support'

export class NftManagerBatchNftMintedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'NftManager.BatchNftMinted')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * nft_id, batch_id, provenance, owner
     */
    get isV4(): boolean {
        return this._chain.getEventHash('NftManager.BatchNftMinted') === 'bf4ed2bc6db2a7504923460bf9705d47128ea6791caacbabaaac33ee10900201'
    }

    /**
     * nft_id, batch_id, provenance, owner
     */
    get asV4(): {nftId: bigint, batchNftId: bigint, authority: Uint8Array, owner: Uint8Array} {
        assert(this.isV4)
        return this._chain.decodeEvent(this.event)
    }
}

export class NftManagerSingleNftMintedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'NftManager.SingleNftMinted')
        this._chain = ctx._chain
        this.event = event
    }

    get isV4(): boolean {
        return this._chain.getEventHash('NftManager.SingleNftMinted') === 'a8e7b268852ec5761965291c86ad84fac0a165d047bc18e80d75b181e281cc41'
    }

    get asV4(): {nftId: bigint, owner: Uint8Array, authority: Uint8Array} {
        assert(this.isV4)
        return this._chain.decodeEvent(this.event)
    }
}
