import assert from 'assert'
import {Chain, ChainContext, EventContext, Event, Result, Option} from './support'
import * as v21 from './v21'

export class NftManagerBatchCreatedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'NftManager.BatchCreated')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * batch_id, total_supply, batch_creator, provenance
     */
    get isV21(): boolean {
        return this._chain.getEventHash('NftManager.BatchCreated') === '444e53a57d5de1115824210f79cf5345f22358b98591752e1535bd55f64323b0'
    }

    /**
     * batch_id, total_supply, batch_creator, provenance
     */
    get asV21(): {batchNftId: bigint, totalSupply: bigint, batchCreator: Uint8Array, authority: Uint8Array} {
        assert(this.isV21)
        return this._chain.decodeEvent(this.event)
    }
}

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
    get isV21(): boolean {
        return this._chain.getEventHash('NftManager.BatchNftMinted') === 'bf4ed2bc6db2a7504923460bf9705d47128ea6791caacbabaaac33ee10900201'
    }

    /**
     * nft_id, batch_id, provenance, owner
     */
    get asV21(): {nftId: bigint, batchNftId: bigint, authority: Uint8Array, owner: Uint8Array} {
        assert(this.isV21)
        return this._chain.decodeEvent(this.event)
    }
}

export class NftManagerEthNftTransferEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'NftManager.EthNftTransfer')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * EthNftTransfer(NftId, NewOwnerAccountId, NftSaleType, u64, EthEventId),
     */
    get isV21(): boolean {
        return this._chain.getEventHash('NftManager.EthNftTransfer') === 'dacd5568e1e613bf13bd61ec2a3dde12c269262c4e693508a6ba11a85c9626b5'
    }

    /**
     * EthNftTransfer(NftId, NewOwnerAccountId, NftSaleType, u64, EthEventId),
     */
    get asV21(): {nftId: bigint, newOwner: Uint8Array, saleType: v21.NftSaleType, opId: bigint, ethEventId: v21.EthEventId} {
        assert(this.isV21)
        return this._chain.decodeEvent(this.event)
    }
}

export class NftManagerFiatNftTransferEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'NftManager.FiatNftTransfer')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * FiatNftTransfer(NftId, SenderAccountId, NewOwnerAccountId, NftSaleType, NftNonce)
     */
    get isV21(): boolean {
        return this._chain.getEventHash('NftManager.FiatNftTransfer') === 'bcc234ffdff6ace39dad4bcb0d4beab866926c346d9b4225c47099b247afde9b'
    }

    /**
     * FiatNftTransfer(NftId, SenderAccountId, NewOwnerAccountId, NftSaleType, NftNonce)
     */
    get asV21(): {nftId: bigint, sender: Uint8Array, newOwner: Uint8Array, saleType: v21.NftSaleType, opId: bigint} {
        assert(this.isV21)
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

    get isV21(): boolean {
        return this._chain.getEventHash('NftManager.SingleNftMinted') === 'a8e7b268852ec5761965291c86ad84fac0a165d047bc18e80d75b181e281cc41'
    }

    get asV21(): {nftId: bigint, owner: Uint8Array, authority: Uint8Array} {
        assert(this.isV21)
        return this._chain.decodeEvent(this.event)
    }
}
