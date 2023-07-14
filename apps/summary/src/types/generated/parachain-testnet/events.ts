import assert from 'assert'
import {Chain, ChainContext, EventContext, Event, Result, Option} from './support'
import * as v4 from './v4'
import * as v21 from './v21'

export class SummarySummaryCalculatedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Summary.SummaryCalculated')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Root hash of summary between from block number and to block number is calculated by a validator
     */
    get isV4(): boolean {
        return this._chain.getEventHash('Summary.SummaryCalculated') === 'd1cf622a2d4f0c9130bb329e159dbcd0de92f74598f25f1ab36f28ba39c26d02'
    }

    /**
     * Root hash of summary between from block number and to block number is calculated by a validator
     */
    get asV4(): {from: number, to: number, rootHash: Uint8Array, submitter: Uint8Array} {
        assert(this.isV4)
        return this._chain.decodeEvent(this.event)
    }
}

export class SummarySummaryRootValidatedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Summary.SummaryRootValidated')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A summary root validated
     */
    get isV21(): boolean {
        return this._chain.getEventHash('Summary.SummaryRootValidated') === 'd2eff693e9f79beb22137134c316f5c46d6a78dac1631d8b18cfa08977c40c17'
    }

    /**
     * A summary root validated
     */
    get asV21(): {rootHash: Uint8Array, ingressCounter: bigint, blockRange: v21.RootRange} {
        assert(this.isV21)
        return this._chain.decodeEvent(this.event)
    }
}

export class SummaryVotingEndedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Summary.VotingEnded')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Voting for the root id is finished, true means the root is approved
     */
    get isV4(): boolean {
        return this._chain.getEventHash('Summary.VotingEnded') === '2a4efe74aab1ffd5fcafc5f773bdd4dc53c70f2abd2cfb39fec0b244681c1ab3'
    }

    /**
     * Voting for the root id is finished, true means the root is approved
     */
    get asV4(): {rootId: v4.RootId, voteApproved: boolean} {
        assert(this.isV4)
        return this._chain.decodeEvent(this.event)
    }
}
