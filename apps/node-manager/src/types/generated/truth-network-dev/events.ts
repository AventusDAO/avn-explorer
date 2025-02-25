import assert from 'assert'
import {Chain, ChainContext, EventContext, Event, Result, Option} from './support'
import * as v3 from './v3'

export class NodeManagerBatchSizeSetEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'NodeManager.BatchSizeSet')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A new reward payment batch size has been set
     */
    get isV3(): boolean {
        return this._chain.getEventHash('NodeManager.BatchSizeSet') === 'eb8d6c57d5f3dd469ab971f51b58aaf72a33fe0f261d022f2ec7ee380a67c4e8'
    }

    /**
     * A new reward payment batch size has been set
     */
    get asV3(): {newSize: number} {
        assert(this.isV3)
        return this._chain.decodeEvent(this.event)
    }
}

export class NodeManagerErrorPayingRewardEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'NodeManager.ErrorPayingReward')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * An error occurred while paying a reward.
     */
    get isV3(): boolean {
        return this._chain.getEventHash('NodeManager.ErrorPayingReward') === '6a04fdd3c08a2f8176efaa9cb8f62107295fda3dd1881039e59530696d119701'
    }

    /**
     * An error occurred while paying a reward.
     */
    get asV3(): {rewardPeriod: bigint, node: Uint8Array, amount: bigint, error: v3.DispatchError} {
        assert(this.isV3)
        return this._chain.decodeEvent(this.event)
    }
}

export class NodeManagerHeartbeatPeriodSetEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'NodeManager.HeartbeatPeriodSet')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A new heartbeat period (in blocks) was set.
     */
    get isV3(): boolean {
        return this._chain.getEventHash('NodeManager.HeartbeatPeriodSet') === 'a168ebd995773e7d985d3ff227aeeda02e9c90eee46f112703274ee3b7961ff9'
    }

    /**
     * A new heartbeat period (in blocks) was set.
     */
    get asV3(): {newHeartbeatPeriod: number} {
        assert(this.isV3)
        return this._chain.decodeEvent(this.event)
    }
}

export class NodeManagerHeartbeatReceivedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'NodeManager.HeartbeatReceived')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A new heartbeat has been received
     */
    get isV3(): boolean {
        return this._chain.getEventHash('NodeManager.HeartbeatReceived') === 'a78e27a64bfc578a42dc595b25ca9306697886d765eee6cde929d7bd49a98321'
    }

    /**
     * A new heartbeat has been received
     */
    get asV3(): {rewardPeriodIndex: bigint, node: Uint8Array} {
        assert(this.isV3)
        return this._chain.decodeEvent(this.event)
    }
}

export class NodeManagerNewRewardPeriodStartedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'NodeManager.NewRewardPeriodStarted')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A new reward period was initialized.
     */
    get isV3(): boolean {
        return this._chain.getEventHash('NodeManager.NewRewardPeriodStarted') === '9f01fb9d2eba58c0caa9195774563b9cecd2b3293dc8ea4227cf71dfec759c72'
    }

    /**
     * A new reward period was initialized.
     */
    get asV3(): {rewardPeriodIndex: bigint, rewardPeriodLength: number, previousPeriodReward: bigint} {
        assert(this.isV3)
        return this._chain.decodeEvent(this.event)
    }
}

export class NodeManagerNodeRegisteredEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'NodeManager.NodeRegistered')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A new node has been registered
     */
    get isV3(): boolean {
        return this._chain.getEventHash('NodeManager.NodeRegistered') === '9ab7ab6e8ee937235ebe96d6f3cb83ef237444d52de7cb70a70b7563dd05bcb9'
    }

    /**
     * A new node has been registered
     */
    get asV3(): {owner: Uint8Array, node: Uint8Array} {
        assert(this.isV3)
        return this._chain.decodeEvent(this.event)
    }
}

export class NodeManagerNodeRegistrarSetEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'NodeManager.NodeRegistrarSet')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A new node registrar has been set
     */
    get isV3(): boolean {
        return this._chain.getEventHash('NodeManager.NodeRegistrarSet') === '3fe640dcd0d6766d7283267017884969a6493626341fe6f765b1306dc741fc29'
    }

    /**
     * A new node registrar has been set
     */
    get asV3(): {newRegistrar: Uint8Array} {
        assert(this.isV3)
        return this._chain.decodeEvent(this.event)
    }
}

export class NodeManagerRewardAmountSetEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'NodeManager.RewardAmountSet')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A new reward amount is set
     */
    get isV3(): boolean {
        return this._chain.getEventHash('NodeManager.RewardAmountSet') === '581be6c939e0b701dde7f0ca4c2b4a4dbc9faecfeae2d9f3608d52b69c4552ab'
    }

    /**
     * A new reward amount is set
     */
    get asV3(): {newAmount: bigint} {
        assert(this.isV3)
        return this._chain.decodeEvent(this.event)
    }
}

export class NodeManagerRewardPaidEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'NodeManager.RewardPaid')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Node received a reward.
     */
    get isV3(): boolean {
        return this._chain.getEventHash('NodeManager.RewardPaid') === '34767d91bfdfd1223180fd1d2ffc87ed02a858f21f977bfd082a1b56913a37e1'
    }

    /**
     * Node received a reward.
     */
    get asV3(): {rewardPeriod: bigint, owner: Uint8Array, node: Uint8Array, amount: bigint} {
        assert(this.isV3)
        return this._chain.decodeEvent(this.event)
    }
}

export class NodeManagerRewardPayoutCompletedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'NodeManager.RewardPayoutCompleted')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * We finished paying all nodes for a particular period.
     */
    get isV3(): boolean {
        return this._chain.getEventHash('NodeManager.RewardPayoutCompleted') === '17437e1ab4c3d00648e115819a33aaaec7e85fc8315df878be64fcd782a50b9e'
    }

    /**
     * We finished paying all nodes for a particular period.
     */
    get asV3(): {rewardPeriodIndex: bigint} {
        assert(this.isV3)
        return this._chain.decodeEvent(this.event)
    }
}

export class NodeManagerRewardPeriodLengthSetEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'NodeManager.RewardPeriodLengthSet')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A new reward period (in blocks) was set.
     */
    get isV3(): boolean {
        return this._chain.getEventHash('NodeManager.RewardPeriodLengthSet') === '287d8a5fb568cf5506a1f1ffdf5c98e9f74f0f5d7f6feefc2457692356a117e9'
    }

    /**
     * A new reward period (in blocks) was set.
     */
    get asV3(): {periodIndex: bigint, oldRewardPeriodLength: number, newRewardPeriodLength: number} {
        assert(this.isV3)
        return this._chain.decodeEvent(this.event)
    }
}

export class NodeManagerRewardToggledEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'NodeManager.RewardToggled')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Reward payment has been toggled
     */
    get isV10(): boolean {
        return this._chain.getEventHash('NodeManager.RewardToggled') === '1a4f33b2dfaeb1147a73dad03c7960562e86062414cb8d5283edde6d1400631d'
    }

    /**
     * Reward payment has been toggled
     */
    get asV10(): {enabled: boolean} {
        assert(this.isV10)
        return this._chain.decodeEvent(this.event)
    }
}
