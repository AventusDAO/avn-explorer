import assert from 'assert'
import {Chain, ChainContext, EventContext, Event, Result, Option} from './support'

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

    get isV4(): boolean {
        return this._chain.getEventHash('TokenManager.TokenTransferred') === '3c9c9f3ffd7d493dd03ff2241837214e10d0709653e219534e8798365aed9672'
    }

    get asV4(): {tokenId: Uint8Array, sender: Uint8Array, recipient: Uint8Array, tokenBalance: bigint} {
        assert(this.isV4)
        return this._chain.decodeEvent(this.event)
    }
}
