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

    get isV1(): boolean {
        return this._chain.getEventHash('TokenManager.TokenLifted') === '11b8d5457647cb1f36f23d53e48797479280fdde33624f1368b8df9e5b78803d'
    }

    get asV1(): [Uint8Array, Uint8Array, bigint, Uint8Array] {
        assert(this.isV1)
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

    get isV1(): boolean {
        return this._chain.getEventHash('TokenManager.TokenLowered') === 'b2c9664a368ef7dfd3f8aceb92ef06c023a6c961fb218384be772f5624571185'
    }

    get asV1(): [Uint8Array, Uint8Array, Uint8Array, bigint, Uint8Array] {
        assert(this.isV1)
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

    get isV1(): boolean {
        return this._chain.getEventHash('TokenManager.TokenTransferred') === 'c060478d479de1f9b83aeaf0d028e913b237364e1fad547e49da907ea388fe26'
    }

    get asV1(): [Uint8Array, Uint8Array, Uint8Array, bigint] {
        assert(this.isV1)
        return this._chain.decodeEvent(this.event)
    }
}
