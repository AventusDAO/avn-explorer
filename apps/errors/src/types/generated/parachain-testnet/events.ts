import assert from 'assert'
import {Chain, ChainContext, EventContext, Event, Result, Option} from './support'
import * as v70 from './v70'

export class AvnProxyInnerCallFailedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'AvnProxy.InnerCallFailed')
        this._chain = ctx._chain
        this.event = event
    }

    get isV70(): boolean {
        return this._chain.getEventHash('AvnProxy.InnerCallFailed') === 'd01f6373fde2c7a226043a19358166e5864d5caf20d6cba3e1a5da9c9062d8db'
    }

    get asV70(): {relayer: Uint8Array, hash: Uint8Array, dispatchError: v70.DispatchError} {
        assert(this.isV70)
        return this._chain.decodeEvent(this.event)
    }
}

export class SystemExtrinsicFailedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'System.ExtrinsicFailed')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * An extrinsic failed.
     */
    get isV70(): boolean {
        return this._chain.getEventHash('System.ExtrinsicFailed') === '89ca818f689e3f6e085d8137a961f36cc94819777211c5c11cca985a448944b8'
    }

    /**
     * An extrinsic failed.
     */
    get asV70(): {dispatchError: v70.DispatchError, dispatchInfo: v70.DispatchInfo} {
        assert(this.isV70)
        return this._chain.decodeEvent(this.event)
    }
}
