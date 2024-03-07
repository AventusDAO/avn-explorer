import assert from 'assert'
import {Chain, ChainContext, EventContext, Event, Result, Option} from './support'

export class TokenManagerTokenLiftedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TokenManager.TokenLifted')
        this._chain = ctx._chain
        this.event = event
    }

    get isV31(): boolean {
        return this._chain.getEventHash('TokenManager.TokenLifted') === '7dd533a3a175b999163443dec188adc3674f125ef7d3d21a748a2fbff1ac4383'
    }

    get asV31(): {tokenId: Uint8Array, recipient: Uint8Array, tokenBalance: bigint, ethTxHash: Uint8Array} {
        assert(this.isV31)
        return this._chain.decodeEvent(this.event)
    }
}

export class TokenManagerTokenLoweredEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TokenManager.TokenLowered')
        this._chain = ctx._chain
        this.event = event
    }

    get isV31(): boolean {
        return this._chain.getEventHash('TokenManager.TokenLowered') === '9b7941fc00100a31ce3a201b3eaedbc4c7ffa2315fecdd973f5a4d82b6cfc711'
    }

    get asV31(): {tokenId: Uint8Array, sender: Uint8Array, recipient: Uint8Array, amount: bigint, t1Recipient: Uint8Array} {
        assert(this.isV31)
        return this._chain.decodeEvent(this.event)
    }

    get isV55(): boolean {
        return this._chain.getEventHash('TokenManager.TokenLowered') === '9569ef92ccde6c2b9f0e7f72a9efbee0dd23f8162ddd5073794481026018379b'
    }

    get asV55(): {tokenId: Uint8Array, sender: Uint8Array, recipient: Uint8Array, amount: bigint, t1Recipient: Uint8Array, lowerId: number} {
        assert(this.isV55)
        return this._chain.decodeEvent(this.event)
    }
}

export class TokenManagerTokenTransferredEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TokenManager.TokenTransferred')
        this._chain = ctx._chain
        this.event = event
    }

    get isV31(): boolean {
        return this._chain.getEventHash('TokenManager.TokenTransferred') === '3c9c9f3ffd7d493dd03ff2241837214e10d0709653e219534e8798365aed9672'
    }

    get asV31(): {tokenId: Uint8Array, sender: Uint8Array, recipient: Uint8Array, tokenBalance: bigint} {
        assert(this.isV31)
        return this._chain.decodeEvent(this.event)
    }
}
