import assert from 'assert'
import {Chain, ChainContext, CallContext, Call, Result, Option} from './support'
import * as v50 from './v50'
import * as v56 from './v56'
import * as v66 from './v66'

export class WorkerNodePalletAddSolutionToGroupCall {
    private readonly _chain: Chain
    private readonly call: Call

    constructor(ctx: CallContext)
    constructor(ctx: ChainContext, call: Call)
    constructor(ctx: CallContext, call?: Call) {
        call = call || ctx.call
        assert(call.name === 'WorkerNodePallet.add_solution_to_group')
        this._chain = ctx._chain
        this.call = call
    }

    /**
     * To add a solution to a solution group
     */
    get isV50(): boolean {
        return this._chain.getCallHash('WorkerNodePallet.add_solution_to_group') === '3859678e39d695c4e1438b6a54010f3f6eada89bbb9cab0daf1a794efff241a9'
    }

    /**
     * To add a solution to a solution group
     */
    get asV50(): {groupNamespace: Uint8Array, solutionNamespace: Uint8Array} {
        assert(this.isV50)
        return this._chain.decodeCall(this.call)
    }
}

export class WorkerNodePalletAllowAccountCall {
    private readonly _chain: Chain
    private readonly call: Call

    constructor(ctx: CallContext)
    constructor(ctx: ChainContext, call: Call)
    constructor(ctx: CallContext, call?: Call) {
        call = call || ctx.call
        assert(call.name === 'WorkerNodePallet.allow_account')
        this._chain = ctx._chain
        this.call = call
    }

    /**
     * Allow account to register solutions
     */
    get isV50(): boolean {
        return this._chain.getCallHash('WorkerNodePallet.allow_account') === '7fb7672b764b0a4f0c4910fddefec0709628843df7ad0073a97eede13c53ca92'
    }

    /**
     * Allow account to register solutions
     */
    get asV50(): {account: Uint8Array} {
        assert(this.isV50)
        return this._chain.decodeCall(this.call)
    }
}

export class WorkerNodePalletAllowOperatorCall {
    private readonly _chain: Chain
    private readonly call: Call

    constructor(ctx: CallContext)
    constructor(ctx: ChainContext, call: Call)
    constructor(ctx: CallContext, call?: Call) {
        call = call || ctx.call
        assert(call.name === 'WorkerNodePallet.allow_operator')
        this._chain = ctx._chain
        this.call = call
    }

    /**
     * Allow operator to subscribe to groups
     */
    get isV50(): boolean {
        return this._chain.getCallHash('WorkerNodePallet.allow_operator') === '4d5cb5747a581b0b6c3e3bd3c011b0ba9a101edf3699bb76b99c397d8f4a7e17'
    }

    /**
     * Allow operator to subscribe to groups
     */
    get asV50(): {groupNamespace: Uint8Array, operator: Uint8Array} {
        assert(this.isV50)
        return this._chain.decodeCall(this.call)
    }
}

export class WorkerNodePalletClaimRewardsCall {
    private readonly _chain: Chain
    private readonly call: Call

    constructor(ctx: CallContext)
    constructor(ctx: ChainContext, call: Call)
    constructor(ctx: CallContext, call?: Call) {
        call = call || ctx.call
        assert(call.name === 'WorkerNodePallet.claim_rewards')
        this._chain = ctx._chain
        this.call = call
    }

    /**
     * Claim all rewards
     */
    get isV50(): boolean {
        return this._chain.getCallHash('WorkerNodePallet.claim_rewards') === '59d5ce9a0d0ceb293c04c9fed07fbf4c3ffc92d765cd0625c7f077e5fee89963'
    }

    /**
     * Claim all rewards
     */
    get asV50(): {groupNamespaces: Uint8Array[]} {
        assert(this.isV50)
        return this._chain.decodeCall(this.call)
    }
}

export class WorkerNodePalletConnectWorkerNodeCall {
    private readonly _chain: Chain
    private readonly call: Call

    constructor(ctx: CallContext)
    constructor(ctx: ChainContext, call: Call)
    constructor(ctx: CallContext, call?: Call) {
        call = call || ctx.call
        assert(call.name === 'WorkerNodePallet.connect_worker_node')
        this._chain = ctx._chain
        this.call = call
    }

    /**
     * Link worker node account to operator account
     */
    get isV50(): boolean {
        return this._chain.getCallHash('WorkerNodePallet.connect_worker_node') === '167d02d9abb3a2cc58988e94a0e67df4b7cca3259b43958fd8552a77f5619322'
    }

    /**
     * Link worker node account to operator account
     */
    get asV50(): {workerNodeAccount: Uint8Array} {
        assert(this.isV50)
        return this._chain.decodeCall(this.call)
    }
}

export class WorkerNodePalletDeleteSolutionCall {
    private readonly _chain: Chain
    private readonly call: Call

    constructor(ctx: CallContext)
    constructor(ctx: ChainContext, call: Call)
    constructor(ctx: CallContext, call?: Call) {
        call = call || ctx.call
        assert(call.name === 'WorkerNodePallet.delete_solution')
        this._chain = ctx._chain
        this.call = call
    }

    /**
     * Terminates a registered solution
     */
    get isV50(): boolean {
        return this._chain.getCallHash('WorkerNodePallet.delete_solution') === 'a48da1a7b83217fa52892550c5c366fde0377d2ec20b58642ef263c425460e1f'
    }

    /**
     * Terminates a registered solution
     */
    get asV50(): {namespace: Uint8Array} {
        assert(this.isV50)
        return this._chain.decodeCall(this.call)
    }
}

export class WorkerNodePalletDeleteSolutionRegistrarCall {
    private readonly _chain: Chain
    private readonly call: Call

    constructor(ctx: CallContext)
    constructor(ctx: ChainContext, call: Call)
    constructor(ctx: CallContext, call?: Call) {
        call = call || ctx.call
        assert(call.name === 'WorkerNodePallet.delete_solution_registrar')
        this._chain = ctx._chain
        this.call = call
    }

    /**
     * De-register an existing solution registrar
     */
    get isV50(): boolean {
        return this._chain.getCallHash('WorkerNodePallet.delete_solution_registrar') === '01f2f9c28aa1d4d36a81ff042620b6677d25bf07c2bf4acc37b58658778a4fca'
    }

    /**
     * De-register an existing solution registrar
     */
    get asV50(): null {
        assert(this.isV50)
        return this._chain.decodeCall(this.call)
    }
}

export class WorkerNodePalletOperatorDeregistrationCall {
    private readonly _chain: Chain
    private readonly call: Call

    constructor(ctx: CallContext)
    constructor(ctx: ChainContext, call: Call)
    constructor(ctx: CallContext, call?: Call) {
        call = call || ctx.call
        assert(call.name === 'WorkerNodePallet.operator_deregistration')
        this._chain = ctx._chain
        this.call = call
    }

    /**
     * To deregister as an operator
     */
    get isV50(): boolean {
        return this._chain.getCallHash('WorkerNodePallet.operator_deregistration') === '01f2f9c28aa1d4d36a81ff042620b6677d25bf07c2bf4acc37b58658778a4fca'
    }

    /**
     * To deregister as an operator
     */
    get asV50(): null {
        assert(this.isV50)
        return this._chain.decodeCall(this.call)
    }
}

export class WorkerNodePalletRegisterSolutionCall {
    private readonly _chain: Chain
    private readonly call: Call

    constructor(ctx: CallContext)
    constructor(ctx: ChainContext, call: Call)
    constructor(ctx: CallContext, call?: Call) {
        call = call || ctx.call
        assert(call.name === 'WorkerNodePallet.register_solution')
        this._chain = ctx._chain
        this.call = call
    }

    /**
     * Registers a solution on EWX
     */
    get isV50(): boolean {
        return this._chain.getCallHash('WorkerNodePallet.register_solution') === 'fbc1ce18a5e7686be88590421f6c255d26274c619704a2680c94d25751b0d611'
    }

    /**
     * Registers a solution on EWX
     */
    get asV50(): {namespace: Uint8Array, name: Uint8Array, description: Uint8Array, publisherInfo: Uint8Array, logoUrl: (Uint8Array | undefined), workLogicCid: Uint8Array, executionEnvironment: v50.ExecutionEnvironment, expirationBlock: number, maxWaitingThreshold: number, voteThresholdPercent: number} {
        assert(this.isV50)
        return this._chain.decodeCall(this.call)
    }

    /**
     * Registers a solution on EWX
     */
    get isV56(): boolean {
        return this._chain.getCallHash('WorkerNodePallet.register_solution') === '7629b73a06d48edae5a594920d58a696b4ce55577ccb55a460e0881c0bc12c17'
    }

    /**
     * Registers a solution on EWX
     */
    get asV56(): {namespace: Uint8Array, name: Uint8Array, description: Uint8Array, publisherInfo: Uint8Array, logoUrl: (Uint8Array | undefined), workLogicCid: Uint8Array, executionEnvironment: v56.ExecutionEnvironment, expirationBlock: number, maxWaitingThreshold: number, voteThresholdPercent: number, additionToExtraneousGroupsAllowed: boolean} {
        assert(this.isV56)
        return this._chain.decodeCall(this.call)
    }
}

export class WorkerNodePalletRemoveAllowedOperatorCall {
    private readonly _chain: Chain
    private readonly call: Call

    constructor(ctx: CallContext)
    constructor(ctx: ChainContext, call: Call)
    constructor(ctx: CallContext, call?: Call) {
        call = call || ctx.call
        assert(call.name === 'WorkerNodePallet.remove_allowed_operator')
        this._chain = ctx._chain
        this.call = call
    }

    /**
     * Remove account from allowed operator accounts
     */
    get isV50(): boolean {
        return this._chain.getCallHash('WorkerNodePallet.remove_allowed_operator') === '4d5cb5747a581b0b6c3e3bd3c011b0ba9a101edf3699bb76b99c397d8f4a7e17'
    }

    /**
     * Remove account from allowed operator accounts
     */
    get asV50(): {groupNamespace: Uint8Array, operator: Uint8Array} {
        assert(this.isV50)
        return this._chain.decodeCall(this.call)
    }
}

export class WorkerNodePalletRemoveSolutionFromGroupCall {
    private readonly _chain: Chain
    private readonly call: Call

    constructor(ctx: CallContext)
    constructor(ctx: ChainContext, call: Call)
    constructor(ctx: CallContext, call?: Call) {
        call = call || ctx.call
        assert(call.name === 'WorkerNodePallet.remove_solution_from_group')
        this._chain = ctx._chain
        this.call = call
    }

    get isV50(): boolean {
        return this._chain.getCallHash('WorkerNodePallet.remove_solution_from_group') === 'a48da1a7b83217fa52892550c5c366fde0377d2ec20b58642ef263c425460e1f'
    }

    get asV50(): {namespace: Uint8Array} {
        assert(this.isV50)
        return this._chain.decodeCall(this.call)
    }
}

export class WorkerNodePalletSetActivationStatusCall {
    private readonly _chain: Chain
    private readonly call: Call

    constructor(ctx: CallContext)
    constructor(ctx: ChainContext, call: Call)
    constructor(ctx: CallContext, call?: Call) {
        call = call || ctx.call
        assert(call.name === 'WorkerNodePallet.set_activation_status')
        this._chain = ctx._chain
        this.call = call
    }

    /**
     * Updates a previously registered solution
     * Pause an existing operational solution
     */
    get isV50(): boolean {
        return this._chain.getCallHash('WorkerNodePallet.set_activation_status') === 'b2f4f222b7cd02c7a99224d57409d6642df85267eb0b1dd48610f4b7d1976bd4'
    }

    /**
     * Updates a previously registered solution
     * Pause an existing operational solution
     */
    get asV50(): {namespace: Uint8Array, newStatus: v50.SolutionStatus} {
        assert(this.isV50)
        return this._chain.decodeCall(this.call)
    }
}

export class WorkerNodePalletSetAdminSettingCall {
    private readonly _chain: Chain
    private readonly call: Call

    constructor(ctx: CallContext)
    constructor(ctx: ChainContext, call: Call)
    constructor(ctx: CallContext, call?: Call) {
        call = call || ctx.call
        assert(call.name === 'WorkerNodePallet.set_admin_setting')
        this._chain = ctx._chain
        this.call = call
    }

    /**
     * Sets an admin setting
     */
    get isV66(): boolean {
        return this._chain.getCallHash('WorkerNodePallet.set_admin_setting') === '09638d3718065586ea2db62c2ab842c4f3f21101c6fb039067d48a6cdd2fed15'
    }

    /**
     * Sets an admin setting
     */
    get asV66(): {value: v66.Type_153} {
        assert(this.isV66)
        return this._chain.decodeCall(this.call)
    }
}

export class WorkerNodePalletSetRewardPeriodLenCall {
    private readonly _chain: Chain
    private readonly call: Call

    constructor(ctx: CallContext)
    constructor(ctx: ChainContext, call: Call)
    constructor(ctx: CallContext, call?: Call) {
        call = call || ctx.call
        assert(call.name === 'WorkerNodePallet.set_reward_period_len')
        this._chain = ctx._chain
        this.call = call
    }

    /**
     * Sets length of the reward period
     */
    get isV50(): boolean {
        return this._chain.getCallHash('WorkerNodePallet.set_reward_period_len') === '8e7c4165616daa6dcb24fb7132a887a07d8b301e6a2323e08a27bb4e01ab08f0'
    }

    /**
     * Sets length of the reward period
     */
    get asV50(): {newLength: number} {
        assert(this.isV50)
        return this._chain.decodeCall(this.call)
    }
}

export class WorkerNodePalletSignupSolutionRegistrarCall {
    private readonly _chain: Chain
    private readonly call: Call

    constructor(ctx: CallContext)
    constructor(ctx: ChainContext, call: Call)
    constructor(ctx: CallContext, call?: Call) {
        call = call || ctx.call
        assert(call.name === 'WorkerNodePallet.signup_solution_registrar')
        this._chain = ctx._chain
        this.call = call
    }

    /**
     * Signs-up as a solution registrar
     */
    get isV50(): boolean {
        return this._chain.getCallHash('WorkerNodePallet.signup_solution_registrar') === 'eb2fb49a4ea68bc9f5a49e7bbba8a59826dbeb96a5497cb7575167dbb9b5dd97'
    }

    /**
     * Signs-up as a solution registrar
     */
    get asV50(): {friendlyName: Uint8Array, legalLocation: Uint8Array} {
        assert(this.isV50)
        return this._chain.decodeCall(this.call)
    }
}

export class WorkerNodePalletSignupWorkerNodeOperatorCall {
    private readonly _chain: Chain
    private readonly call: Call

    constructor(ctx: CallContext)
    constructor(ctx: ChainContext, call: Call)
    constructor(ctx: CallContext, call?: Call) {
        call = call || ctx.call
        assert(call.name === 'WorkerNodePallet.signup_worker_node_operator')
        this._chain = ctx._chain
        this.call = call
    }

    /**
     * To sign-up as an operator
     */
    get isV50(): boolean {
        return this._chain.getCallHash('WorkerNodePallet.signup_worker_node_operator') === 'eb2fb49a4ea68bc9f5a49e7bbba8a59826dbeb96a5497cb7575167dbb9b5dd97'
    }

    /**
     * To sign-up as an operator
     */
    get asV50(): {friendlyName: Uint8Array, legalLocation: Uint8Array} {
        assert(this.isV50)
        return this._chain.decodeCall(this.call)
    }
}

export class WorkerNodePalletSolutionGroupDeregistrationCall {
    private readonly _chain: Chain
    private readonly call: Call

    constructor(ctx: CallContext)
    constructor(ctx: ChainContext, call: Call)
    constructor(ctx: CallContext, call?: Call) {
        call = call || ctx.call
        assert(call.name === 'WorkerNodePallet.solution_group_deregistration')
        this._chain = ctx._chain
        this.call = call
    }

    /**
     * Remove previously registered solution group
     */
    get isV50(): boolean {
        return this._chain.getCallHash('WorkerNodePallet.solution_group_deregistration') === 'a48da1a7b83217fa52892550c5c366fde0377d2ec20b58642ef263c425460e1f'
    }

    /**
     * Remove previously registered solution group
     */
    get asV50(): {namespace: Uint8Array} {
        assert(this.isV50)
        return this._chain.decodeCall(this.call)
    }
}

export class WorkerNodePalletSolutionGroupRegistrationCall {
    private readonly _chain: Chain
    private readonly call: Call

    constructor(ctx: CallContext)
    constructor(ctx: ChainContext, call: Call)
    constructor(ctx: CallContext, call?: Call) {
        call = call || ctx.call
        assert(call.name === 'WorkerNodePallet.solution_group_registration')
        this._chain = ctx._chain
        this.call = call
    }

    /**
     * Specify a list of worker node networks to be a part of a particular solution group
     */
    get isV50(): boolean {
        return this._chain.getCallHash('WorkerNodePallet.solution_group_registration') === '766b40473e711e6cf9e06fe90656b103f2c75be74a85a3aa692312e47150a392'
    }

    /**
     * Specify a list of worker node networks to be a part of a particular solution group
     */
    get asV50(): {namespace: Uint8Array, info: v50.EntityInfo, operatorsConfig: v50.OperatorConfig, rewardsConfig: v50.RewardsConfiguration, operationStartBlock: number, operationEndBlock: number} {
        assert(this.isV50)
        return this._chain.decodeCall(this.call)
    }
}

export class WorkerNodePalletSubmitSolutionResultCall {
    private readonly _chain: Chain
    private readonly call: Call

    constructor(ctx: CallContext)
    constructor(ctx: ChainContext, call: Call)
    constructor(ctx: CallContext, call?: Call) {
        call = call || ctx.call
        assert(call.name === 'WorkerNodePallet.submit_solution_result')
        this._chain = ctx._chain
        this.call = call
    }

    /**
     * Submit hash of the solution result
     * 
     * Vote can not be submitted in the same reward period, when subscription was created,
     * because subscription stake is put in next reward period. Stake can be put
     * starting from the second block of the reward period, next after period
     * when subscription was created. If number of subscriptions more than
     * `PROCESSING_BATCH_SIZE`, then more blocks might be needed to be finalized before
     * subscription stake is put.
     * 
     * # Panics
     * 
     * The submission will panic in this cases:
     * * Sender was not assigned by operator to submit vote;
     * * Operator of the worker was not subscribed to the group of the solution or stake of
     *   subscription was not put yet;
     */
    get isV50(): boolean {
        return this._chain.getCallHash('WorkerNodePallet.submit_solution_result') === 'db4fd56147aed983cf7de99b823d53311d19bd65655a4a3a0f3416a843b39eff'
    }

    /**
     * Submit hash of the solution result
     * 
     * Vote can not be submitted in the same reward period, when subscription was created,
     * because subscription stake is put in next reward period. Stake can be put
     * starting from the second block of the reward period, next after period
     * when subscription was created. If number of subscriptions more than
     * `PROCESSING_BATCH_SIZE`, then more blocks might be needed to be finalized before
     * subscription stake is put.
     * 
     * # Panics
     * 
     * The submission will panic in this cases:
     * * Sender was not assigned by operator to submit vote;
     * * Operator of the worker was not subscribed to the group of the solution or stake of
     *   subscription was not put yet;
     */
    get asV50(): {solutionNamespace: Uint8Array, votingRoundId: Uint8Array, result: Uint8Array, signature: Uint8Array, pubKey: Uint8Array} {
        assert(this.isV50)
        return this._chain.decodeCall(this.call)
    }
}

export class WorkerNodePalletSubscribeToSolutionGroupCall {
    private readonly _chain: Chain
    private readonly call: Call

    constructor(ctx: CallContext)
    constructor(ctx: ChainContext, call: Call)
    constructor(ctx: CallContext, call?: Call) {
        call = call || ctx.call
        assert(call.name === 'WorkerNodePallet.subscribe_to_solution_group')
        this._chain = ctx._chain
        this.call = call
    }

    /**
     * To subscribe operator to solution group
     */
    get isV50(): boolean {
        return this._chain.getCallHash('WorkerNodePallet.subscribe_to_solution_group') === '7b61aeb3124f8c2df098b50b5883b28bc0c6d03ed160db2f1151cd5b70463a20'
    }

    /**
     * To subscribe operator to solution group
     */
    get asV50(): {namespace: Uint8Array, stakeAmount: bigint} {
        assert(this.isV50)
        return this._chain.decodeCall(this.call)
    }
}

export class WorkerNodePalletTopUpStakeCall {
    private readonly _chain: Chain
    private readonly call: Call

    constructor(ctx: CallContext)
    constructor(ctx: ChainContext, call: Call)
    constructor(ctx: CallContext, call?: Call) {
        call = call || ctx.call
        assert(call.name === 'WorkerNodePallet.top_up_stake')
        this._chain = ctx._chain
        this.call = call
    }

    /**
     * See [`Pallet::top_up_stake`].
     */
    get isV71(): boolean {
        return this._chain.getCallHash('WorkerNodePallet.top_up_stake') === '2810a85b14aa48ab2324fd43f4c6cc5a6d39787238c9b19451b918be2653764c'
    }

    /**
     * See [`Pallet::top_up_stake`].
     */
    get asV71(): {groupName: Uint8Array, increaseAmount: bigint} {
        assert(this.isV71)
        return this._chain.decodeCall(this.call)
    }
}

export class WorkerNodePalletUnsubscribeFromSolutionGroupCall {
    private readonly _chain: Chain
    private readonly call: Call

    constructor(ctx: CallContext)
    constructor(ctx: ChainContext, call: Call)
    constructor(ctx: CallContext, call?: Call) {
        call = call || ctx.call
        assert(call.name === 'WorkerNodePallet.unsubscribe_from_solution_group')
        this._chain = ctx._chain
        this.call = call
    }

    /**
     * Unsubscribe worker node operator from a solution group [EWX-151]
     */
    get isV50(): boolean {
        return this._chain.getCallHash('WorkerNodePallet.unsubscribe_from_solution_group') === 'a48da1a7b83217fa52892550c5c366fde0377d2ec20b58642ef263c425460e1f'
    }

    /**
     * Unsubscribe worker node operator from a solution group [EWX-151]
     */
    get asV50(): {namespace: Uint8Array} {
        assert(this.isV50)
        return this._chain.decodeCall(this.call)
    }
}
