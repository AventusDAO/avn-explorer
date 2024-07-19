import assert from 'assert'
import {Chain, ChainContext, EventContext, Event, Result, Option} from './support'
import * as v50 from './v50'
import * as v66 from './v66'

export class WorkerNodePalletAdminSettingsUpdatedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'WorkerNodePallet.AdminSettingsUpdated')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * An admin settings value has been updated
     */
    get isV66(): boolean {
        return this._chain.getEventHash('WorkerNodePallet.AdminSettingsUpdated') === '09638d3718065586ea2db62c2ab842c4f3f21101c6fb039067d48a6cdd2fed15'
    }

    /**
     * An admin settings value has been updated
     */
    get asV66(): {value: v66.Type_153} {
        assert(this.isV66)
        return this._chain.decodeEvent(this.event)
    }
}

export class WorkerNodePalletNewOperatorAllowedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'WorkerNodePallet.NewOperatorAllowed')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Signals account added to allowed operators
     */
    get isV50(): boolean {
        return this._chain.getEventHash('WorkerNodePallet.NewOperatorAllowed') === '1e2713efb65114597ed1c5d791da173e5bb427cca368815c69e1f8390525f949'
    }

    /**
     * Signals account added to allowed operators
     */
    get asV50(): {operator: Uint8Array} {
        assert(this.isV50)
        return this._chain.decodeEvent(this.event)
    }
}

export class WorkerNodePalletNewRegistrarAllowedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'WorkerNodePallet.NewRegistrarAllowed')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Signals account added to allowed accounts
     */
    get isV50(): boolean {
        return this._chain.getEventHash('WorkerNodePallet.NewRegistrarAllowed') === 'f75531dcd4e47545c0c6c3f34179051bcc966f9a4a4b0ee9f56c1ba4f350dab2'
    }

    /**
     * Signals account added to allowed accounts
     */
    get asV50(): {registrar: Uint8Array} {
        assert(this.isV50)
        return this._chain.decodeEvent(this.event)
    }
}

export class WorkerNodePalletNewRewardPeriodEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'WorkerNodePallet.NewRewardPeriod')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Started new reward period.
     */
    get isV50(): boolean {
        return this._chain.getEventHash('WorkerNodePallet.NewRewardPeriod') === 'c06fe721de32f28c5c2cb83528925b52b5cf63823852a495a13bc11fb9387892'
    }

    /**
     * Started new reward period.
     */
    get asV50(): {startingBlock: number, index: number, length: number} {
        assert(this.isV50)
        return this._chain.decodeEvent(this.event)
    }
}

export class WorkerNodePalletNewSolutionGroupSubscriptionEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'WorkerNodePallet.NewSolutionGroupSubscription')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Signals new subscription to solution [who, solution]
     */
    get isV50(): boolean {
        return this._chain.getEventHash('WorkerNodePallet.NewSolutionGroupSubscription') === '0a32e5c337ed87942249c5dc99a017992c8177ce9bb00d6f2b755bfaeaba43e9'
    }

    /**
     * Signals new subscription to solution [who, solution]
     */
    get asV50(): {operator: Uint8Array, namespace: Uint8Array} {
        assert(this.isV50)
        return this._chain.decodeEvent(this.event)
    }
}

export class WorkerNodePalletNewSolutionRegistrarSignupEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'WorkerNodePallet.NewSolutionRegistrarSignup')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Signals the signup of a new solution Registrar [who, friendly name, legal location]
     */
    get isV50(): boolean {
        return this._chain.getEventHash('WorkerNodePallet.NewSolutionRegistrarSignup') === '029f6e0fc425e6f4354a51ff2eaca55f9ab13ef523d9a2c96d24bb1c2a47b3bd'
    }

    /**
     * Signals the signup of a new solution Registrar [who, friendly name, legal location]
     */
    get asV50(): {registrar: Uint8Array, friendlyName: Uint8Array, legalLocation: Uint8Array} {
        assert(this.isV50)
        return this._chain.decodeEvent(this.event)
    }
}

export class WorkerNodePalletNewWorkerConnectedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'WorkerNodePallet.NewWorkerConnected')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Signals the registration of a new worker node [operator, worker]
     */
    get isV50(): boolean {
        return this._chain.getEventHash('WorkerNodePallet.NewWorkerConnected') === '5893c3d74443a756e2d873e789bec7c5ae9e5d4f420c83fc2b507be69ddb1163'
    }

    /**
     * Signals the registration of a new worker node [operator, worker]
     */
    get asV50(): {operator: Uint8Array, worker: Uint8Array} {
        assert(this.isV50)
        return this._chain.decodeEvent(this.event)
    }
}

export class WorkerNodePalletNewWorkerNodeOperatorSignupEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'WorkerNodePallet.NewWorkerNodeOperatorSignup')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Signals the signup of a new worker node operator [who, friendly_name, location]
     */
    get isV50(): boolean {
        return this._chain.getEventHash('WorkerNodePallet.NewWorkerNodeOperatorSignup') === 'e694a934d0b6b9ed5c3c041f16ed13d4e503bcb54381c088b55a30ca4dc31f33'
    }

    /**
     * Signals the signup of a new worker node operator [who, friendly_name, location]
     */
    get asV50(): {operator: Uint8Array, friendlyName: Uint8Array, legalLocation: Uint8Array} {
        assert(this.isV50)
        return this._chain.decodeEvent(this.event)
    }
}

export class WorkerNodePalletRemovedSolutionEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'WorkerNodePallet.RemovedSolution')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Signals the removal of a solution
     */
    get isV50(): boolean {
        return this._chain.getEventHash('WorkerNodePallet.RemovedSolution') === 'f4802b672054d6af9c412e640b56331f3b9840846fb3f976ef8bd96f6842f5cd'
    }

    /**
     * Signals the removal of a solution
     */
    get asV50(): {registrar: Uint8Array, namespace: Uint8Array} {
        assert(this.isV50)
        return this._chain.decodeEvent(this.event)
    }
}

export class WorkerNodePalletRemovedSolutionRegistrarEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'WorkerNodePallet.RemovedSolutionRegistrar')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Signals the removal of a solution registrar
     */
    get isV50(): boolean {
        return this._chain.getEventHash('WorkerNodePallet.RemovedSolutionRegistrar') === 'f75531dcd4e47545c0c6c3f34179051bcc966f9a4a4b0ee9f56c1ba4f350dab2'
    }

    /**
     * Signals the removal of a solution registrar
     */
    get asV50(): {registrar: Uint8Array} {
        assert(this.isV50)
        return this._chain.decodeEvent(this.event)
    }
}

export class WorkerNodePalletRewardsCalculatedForPeriodEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'WorkerNodePallet.RewardsCalculatedForPeriod')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Rewards calculated for reward period.
     */
    get isV50(): boolean {
        return this._chain.getEventHash('WorkerNodePallet.RewardsCalculatedForPeriod') === '25a99cc820e15400356f62165725d9d84847d859e62ca1e5fd6eb340dc5c217e'
    }

    /**
     * Rewards calculated for reward period.
     */
    get asV50(): {index: number} {
        assert(this.isV50)
        return this._chain.decodeEvent(this.event)
    }
}

export class WorkerNodePalletRewardsClaimedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'WorkerNodePallet.RewardsClaimed')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Signals the claiming of rewards
     */
    get isV50(): boolean {
        return this._chain.getEventHash('WorkerNodePallet.RewardsClaimed') === '1e2713efb65114597ed1c5d791da173e5bb427cca368815c69e1f8390525f949'
    }

    /**
     * Signals the claiming of rewards
     */
    get asV50(): {operator: Uint8Array} {
        assert(this.isV50)
        return this._chain.decodeEvent(this.event)
    }
}

export class WorkerNodePalletSolutionAddedToGroupEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'WorkerNodePallet.SolutionAddedToGroup')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Signals new solution added to a SolutionGroup
     */
    get isV50(): boolean {
        return this._chain.getEventHash('WorkerNodePallet.SolutionAddedToGroup') === '3af4889cf3a5071bd0cd7387dc5e7b3949f474d035ac652b23ff0f5030e79954'
    }

    /**
     * Signals new solution added to a SolutionGroup
     */
    get asV50(): {solutionName: Uint8Array, solutionGroup: Uint8Array} {
        assert(this.isV50)
        return this._chain.decodeEvent(this.event)
    }
}

export class WorkerNodePalletSolutionCreatedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'WorkerNodePallet.SolutionCreated')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Signals the signup of a new solution [who, namespace]
     */
    get isV50(): boolean {
        return this._chain.getEventHash('WorkerNodePallet.SolutionCreated') === 'f4802b672054d6af9c412e640b56331f3b9840846fb3f976ef8bd96f6842f5cd'
    }

    /**
     * Signals the signup of a new solution [who, namespace]
     */
    get asV50(): {registrar: Uint8Array, namespace: Uint8Array} {
        assert(this.isV50)
        return this._chain.decodeEvent(this.event)
    }
}

export class WorkerNodePalletSolutionGroupCreatedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'WorkerNodePallet.SolutionGroupCreated')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Signals the signup of a new solution group [who, namespace]
     */
    get isV50(): boolean {
        return this._chain.getEventHash('WorkerNodePallet.SolutionGroupCreated') === 'f4802b672054d6af9c412e640b56331f3b9840846fb3f976ef8bd96f6842f5cd'
    }

    /**
     * Signals the signup of a new solution group [who, namespace]
     */
    get asV50(): {registrar: Uint8Array, namespace: Uint8Array} {
        assert(this.isV50)
        return this._chain.decodeEvent(this.event)
    }
}

export class WorkerNodePalletSolutionGroupRemovedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'WorkerNodePallet.SolutionGroupRemoved')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Signals removal of the group [registrar, group]
     */
    get isV50(): boolean {
        return this._chain.getEventHash('WorkerNodePallet.SolutionGroupRemoved') === 'f4802b672054d6af9c412e640b56331f3b9840846fb3f976ef8bd96f6842f5cd'
    }

    /**
     * Signals removal of the group [registrar, group]
     */
    get asV50(): {registrar: Uint8Array, namespace: Uint8Array} {
        assert(this.isV50)
        return this._chain.decodeEvent(this.event)
    }
}

export class WorkerNodePalletSolutionRemovedFromGroupEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'WorkerNodePallet.SolutionRemovedFromGroup')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Signals the removal of a solution from a SolutionGroup
     */
    get isV50(): boolean {
        return this._chain.getEventHash('WorkerNodePallet.SolutionRemovedFromGroup') === '3af4889cf3a5071bd0cd7387dc5e7b3949f474d035ac652b23ff0f5030e79954'
    }

    /**
     * Signals the removal of a solution from a SolutionGroup
     */
    get asV50(): {solutionName: Uint8Array, solutionGroup: Uint8Array} {
        assert(this.isV50)
        return this._chain.decodeEvent(this.event)
    }
}

export class WorkerNodePalletSolutionResultSubmittedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'WorkerNodePallet.SolutionResultSubmitted')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Signals that a vote has been submitted towards a particular solution result
     */
    get isV50(): boolean {
        return this._chain.getEventHash('WorkerNodePallet.SolutionResultSubmitted') === '87b7708b7202271a6a2ce3d48d5fbf534df182fcf756de0a9ac6acbf736edc59'
    }

    /**
     * Signals that a vote has been submitted towards a particular solution result
     */
    get asV50(): {solutionNamespace: Uint8Array, votingRoundId: Uint8Array, result: Uint8Array} {
        assert(this.isV50)
        return this._chain.decodeEvent(this.event)
    }
}

export class WorkerNodePalletSolutionStatusChangedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'WorkerNodePallet.SolutionStatusChanged')
        this._chain = ctx._chain
        this.event = event
    }

    get isV50(): boolean {
        return this._chain.getEventHash('WorkerNodePallet.SolutionStatusChanged') === '58e2f033b18e5d796b1e0652c7e1272834156f6cb977957edb71dd87e4d253b7'
    }

    get asV50(): {namespace: Uint8Array, oldStatus: v50.SolutionStatus, newStatus: v50.SolutionStatus} {
        assert(this.isV50)
        return this._chain.decodeEvent(this.event)
    }
}

export class WorkerNodePalletStakeIncreasedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'WorkerNodePallet.StakeIncreased')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Signals the increase of an operator's stake
     */
    get isV71(): boolean {
        return this._chain.getEventHash('WorkerNodePallet.StakeIncreased') === 'ea0e3d1e59c928fc24fe9ae2fdad93894b607185dd9625b7f5f4d3d2fb62c48a'
    }

    /**
     * Signals the increase of an operator's stake
     */
    get asV71(): {operator: Uint8Array, increaseAmount: bigint, newStakeAmount: bigint} {
        assert(this.isV71)
        return this._chain.decodeEvent(this.event)
    }
}

export class WorkerNodePalletUnsubscribeFromSolutionGroupEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'WorkerNodePallet.UnsubscribeFromSolutionGroup')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Signals unsubscribing from a solution group [who, solution]
     */
    get isV50(): boolean {
        return this._chain.getEventHash('WorkerNodePallet.UnsubscribeFromSolutionGroup') === '0a32e5c337ed87942249c5dc99a017992c8177ce9bb00d6f2b755bfaeaba43e9'
    }

    /**
     * Signals unsubscribing from a solution group [who, solution]
     */
    get asV50(): {operator: Uint8Array, namespace: Uint8Array} {
        assert(this.isV50)
        return this._chain.decodeEvent(this.event)
    }
}

export class WorkerNodePalletWorkerNodeOperatorRemovalEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'WorkerNodePallet.WorkerNodeOperatorRemoval')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Signals the removal of a worker node operator
     */
    get isV50(): boolean {
        return this._chain.getEventHash('WorkerNodePallet.WorkerNodeOperatorRemoval') === '1e2713efb65114597ed1c5d791da173e5bb427cca368815c69e1f8390525f949'
    }

    /**
     * Signals the removal of a worker node operator
     */
    get asV50(): {operator: Uint8Array} {
        assert(this.isV50)
        return this._chain.decodeEvent(this.event)
    }
}
