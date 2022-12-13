import assert from 'assert'
import {Chain, ChainContext, EventContext, Event, Result, Option} from './support'
import * as v12 from './v12'

export class ParachainStakingNominationEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'ParachainStaking.Nomination')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * New nomination (increase of the existing one).
     */
    get isV12(): boolean {
        return this._chain.getEventHash('ParachainStaking.Nomination') === '2063c0fb05ba11ddf19d3efa92f92ca2d86fd1708621d08368bae26580469161'
    }

    /**
     * New nomination (increase of the existing one).
     */
    get asV12(): {nominator: Uint8Array, lockedAmount: bigint, candidate: Uint8Array, nominatorPosition: v12.NominatorAdded} {
        assert(this.isV12)
        return this._chain.decodeEvent(this.event)
    }
}

export class ParachainStakingNominationDecreasedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'ParachainStaking.NominationDecreased')
        this._chain = ctx._chain
        this.event = event
    }

    get isV12(): boolean {
        return this._chain.getEventHash('ParachainStaking.NominationDecreased') === 'dd4415be8010a91cb1ca6fd47832e7344c34ccb86c4ec0514293b4121131b56f'
    }

    get asV12(): {nominator: Uint8Array, candidate: Uint8Array, amount: bigint, inTop: boolean} {
        assert(this.isV12)
        return this._chain.decodeEvent(this.event)
    }
}

export class ParachainStakingNominationIncreasedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'ParachainStaking.NominationIncreased')
        this._chain = ctx._chain
        this.event = event
    }

    get isV12(): boolean {
        return this._chain.getEventHash('ParachainStaking.NominationIncreased') === 'dd4415be8010a91cb1ca6fd47832e7344c34ccb86c4ec0514293b4121131b56f'
    }

    get asV12(): {nominator: Uint8Array, candidate: Uint8Array, amount: bigint, inTop: boolean} {
        assert(this.isV12)
        return this._chain.decodeEvent(this.event)
    }
}

export class ParachainStakingNominationKickedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'ParachainStaking.NominationKicked')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Nomination kicked.
     */
    get isV12(): boolean {
        return this._chain.getEventHash('ParachainStaking.NominationKicked') === '3420396624af842b4d7d1627f45b38cda24d741906d874ca592ebdba548a702a'
    }

    /**
     * Nomination kicked.
     */
    get asV12(): {nominator: Uint8Array, candidate: Uint8Array, unstakedAmount: bigint} {
        assert(this.isV12)
        return this._chain.decodeEvent(this.event)
    }
}

export class ParachainStakingNominationRevokedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'ParachainStaking.NominationRevoked')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Nomination revoked.
     */
    get isV12(): boolean {
        return this._chain.getEventHash('ParachainStaking.NominationRevoked') === '3420396624af842b4d7d1627f45b38cda24d741906d874ca592ebdba548a702a'
    }

    /**
     * Nomination revoked.
     */
    get asV12(): {nominator: Uint8Array, candidate: Uint8Array, unstakedAmount: bigint} {
        assert(this.isV12)
        return this._chain.decodeEvent(this.event)
    }
}

export class ParachainStakingNominatorLeftEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'ParachainStaking.NominatorLeft')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Nominator has left the set of nominators.
     */
    get isV12(): boolean {
        return this._chain.getEventHash('ParachainStaking.NominatorLeft') === 'bd751a1c7aa30b0b784c355a6a3893803e93a535025b780c3858483ecadaa460'
    }

    /**
     * Nominator has left the set of nominators.
     */
    get asV12(): {nominator: Uint8Array, unstakedAmount: bigint} {
        assert(this.isV12)
        return this._chain.decodeEvent(this.event)
    }
}

export class ParachainStakingNominatorLeftCandidateEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'ParachainStaking.NominatorLeftCandidate')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Nomination from candidate state has been remove.
     */
    get isV12(): boolean {
        return this._chain.getEventHash('ParachainStaking.NominatorLeftCandidate') === '4bdd3b14fca150d54e80b11abde71312183de8bc09b57b745efac04308497901'
    }

    /**
     * Nomination from candidate state has been remove.
     */
    get asV12(): {nominator: Uint8Array, candidate: Uint8Array, unstakedAmount: bigint, totalCandidateStaked: bigint} {
        assert(this.isV12)
        return this._chain.decodeEvent(this.event)
    }
}
