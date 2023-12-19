import assert from 'assert'
import {Chain, ChainContext, EventContext, Event, Result, Option} from './support'
import * as v4 from './v4'
import * as v43 from './v43'

export class BalancesBalanceSetEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Balances.BalanceSet')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A balance was set by root.
     */
    get isV4(): boolean {
        return this._chain.getEventHash('Balances.BalanceSet') === '1e2b5d5a07046e6d6e5507661d3f3feaddfb41fc609a2336b24957322080ca77'
    }

    /**
     * A balance was set by root.
     */
    get asV4(): {who: Uint8Array, free: bigint, reserved: bigint} {
        assert(this.isV4)
        return this._chain.decodeEvent(this.event)
    }
}

export class BalancesDepositEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Balances.Deposit')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Some amount was deposited (e.g. for transaction fees).
     */
    get isV4(): boolean {
        return this._chain.getEventHash('Balances.Deposit') === 'e84a34a6a3d577b31f16557bd304282f4fe4cbd7115377f4687635dc48e52ba5'
    }

    /**
     * Some amount was deposited (e.g. for transaction fees).
     */
    get asV4(): {who: Uint8Array, amount: bigint} {
        assert(this.isV4)
        return this._chain.decodeEvent(this.event)
    }
}

export class BalancesEndowedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Balances.Endowed')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * An account was created with some free balance.
     */
    get isV4(): boolean {
        return this._chain.getEventHash('Balances.Endowed') === '75951f685df19cbb5fdda09cf928a105518ceca9576d95bd18d4fac8802730ca'
    }

    /**
     * An account was created with some free balance.
     */
    get asV4(): {account: Uint8Array, freeBalance: bigint} {
        assert(this.isV4)
        return this._chain.decodeEvent(this.event)
    }
}

export class BalancesReserveRepatriatedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Balances.ReserveRepatriated')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Some balance was moved from the reserve of the first account to the second account.
     * Final argument indicates the destination balance type.
     */
    get isV4(): boolean {
        return this._chain.getEventHash('Balances.ReserveRepatriated') === '6232d50d422cea3a6fd21da36387df36d1d366405d0c589566c6de85c9cf541f'
    }

    /**
     * Some balance was moved from the reserve of the first account to the second account.
     * Final argument indicates the destination balance type.
     */
    get asV4(): {from: Uint8Array, to: Uint8Array, amount: bigint, destinationStatus: v4.BalanceStatus} {
        assert(this.isV4)
        return this._chain.decodeEvent(this.event)
    }
}

export class BalancesReservedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Balances.Reserved')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Some balance was reserved (moved from free to reserved).
     */
    get isV4(): boolean {
        return this._chain.getEventHash('Balances.Reserved') === 'e84a34a6a3d577b31f16557bd304282f4fe4cbd7115377f4687635dc48e52ba5'
    }

    /**
     * Some balance was reserved (moved from free to reserved).
     */
    get asV4(): {who: Uint8Array, amount: bigint} {
        assert(this.isV4)
        return this._chain.decodeEvent(this.event)
    }
}

export class BalancesSlashedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Balances.Slashed')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Some amount was removed from the account (e.g. for misbehavior).
     */
    get isV4(): boolean {
        return this._chain.getEventHash('Balances.Slashed') === 'e84a34a6a3d577b31f16557bd304282f4fe4cbd7115377f4687635dc48e52ba5'
    }

    /**
     * Some amount was removed from the account (e.g. for misbehavior).
     */
    get asV4(): {who: Uint8Array, amount: bigint} {
        assert(this.isV4)
        return this._chain.decodeEvent(this.event)
    }
}

export class BalancesTransferEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Balances.Transfer')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Transfer succeeded.
     */
    get isV4(): boolean {
        return this._chain.getEventHash('Balances.Transfer') === '0ffdf35c495114c2d42a8bf6c241483fd5334ca0198662e14480ad040f1e3a66'
    }

    /**
     * Transfer succeeded.
     */
    get asV4(): {from: Uint8Array, to: Uint8Array, amount: bigint} {
        assert(this.isV4)
        return this._chain.decodeEvent(this.event)
    }
}

export class BalancesUnreservedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Balances.Unreserved')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Some balance was unreserved (moved from reserved to free).
     */
    get isV4(): boolean {
        return this._chain.getEventHash('Balances.Unreserved') === 'e84a34a6a3d577b31f16557bd304282f4fe4cbd7115377f4687635dc48e52ba5'
    }

    /**
     * Some balance was unreserved (moved from reserved to free).
     */
    get asV4(): {who: Uint8Array, amount: bigint} {
        assert(this.isV4)
        return this._chain.decodeEvent(this.event)
    }
}

export class BalancesWithdrawEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Balances.Withdraw')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Some amount was withdrawn from the account (e.g. for transaction fees).
     */
    get isV4(): boolean {
        return this._chain.getEventHash('Balances.Withdraw') === 'e84a34a6a3d577b31f16557bd304282f4fe4cbd7115377f4687635dc48e52ba5'
    }

    /**
     * Some amount was withdrawn from the account (e.g. for transaction fees).
     */
    get asV4(): {who: Uint8Array, amount: bigint} {
        assert(this.isV4)
        return this._chain.decodeEvent(this.event)
    }
}

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
    get isV4(): boolean {
        return this._chain.getEventHash('NftManager.BatchCreated') === '444e53a57d5de1115824210f79cf5345f22358b98591752e1535bd55f64323b0'
    }

    /**
     * batch_id, total_supply, batch_creator, provenance
     */
    get asV4(): {batchNftId: bigint, totalSupply: bigint, batchCreator: Uint8Array, authority: Uint8Array} {
        assert(this.isV4)
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
    get isV4(): boolean {
        return this._chain.getEventHash('NftManager.BatchNftMinted') === 'bf4ed2bc6db2a7504923460bf9705d47128ea6791caacbabaaac33ee10900201'
    }

    /**
     * nft_id, batch_id, provenance, owner
     */
    get asV4(): {nftId: bigint, batchNftId: bigint, authority: Uint8Array, owner: Uint8Array} {
        assert(this.isV4)
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
    get isV4(): boolean {
        return this._chain.getEventHash('NftManager.EthNftTransfer') === 'dacd5568e1e613bf13bd61ec2a3dde12c269262c4e693508a6ba11a85c9626b5'
    }

    /**
     * EthNftTransfer(NftId, NewOwnerAccountId, NftSaleType, u64, EthEventId),
     */
    get asV4(): {nftId: bigint, newOwner: Uint8Array, saleType: v4.NftSaleType, opId: bigint, ethEventId: v4.EthEventId} {
        assert(this.isV4)
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
    get isV4(): boolean {
        return this._chain.getEventHash('NftManager.FiatNftTransfer') === 'bcc234ffdff6ace39dad4bcb0d4beab866926c346d9b4225c47099b247afde9b'
    }

    /**
     * FiatNftTransfer(NftId, SenderAccountId, NewOwnerAccountId, NftSaleType, NftNonce)
     */
    get asV4(): {nftId: bigint, sender: Uint8Array, newOwner: Uint8Array, saleType: v4.NftSaleType, opId: bigint} {
        assert(this.isV4)
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

    get isV4(): boolean {
        return this._chain.getEventHash('NftManager.SingleNftMinted') === 'a8e7b268852ec5761965291c86ad84fac0a165d047bc18e80d75b181e281cc41'
    }

    get asV4(): {nftId: bigint, owner: Uint8Array, authority: Uint8Array} {
        assert(this.isV4)
        return this._chain.decodeEvent(this.event)
    }
}

export class SchedulerCanceledEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Scheduler.Canceled')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Canceled some task.
     */
    get isV43(): boolean {
        return this._chain.getEventHash('Scheduler.Canceled') === '4186e24556a58b04e04d6d697a530eedf78f255da1ba9d84df6511dd6d6465f7'
    }

    /**
     * Canceled some task.
     */
    get asV43(): {when: number, index: number} {
        assert(this.isV43)
        return this._chain.decodeEvent(this.event)
    }
}

export class SchedulerDispatchedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Scheduler.Dispatched')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Dispatched some task.
     */
    get isV43(): boolean {
        return this._chain.getEventHash('Scheduler.Dispatched') === 'b67102cc706599639b8e52e776b81c51142dad43652e91e7e72197b7df9a63f4'
    }

    /**
     * Dispatched some task.
     */
    get asV43(): {task: [number, number], id: (Uint8Array | undefined), result: v43.Type_94} {
        assert(this.isV43)
        return this._chain.decodeEvent(this.event)
    }
}

export class SchedulerScheduledEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Scheduler.Scheduled')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Scheduled some task.
     */
    get isV43(): boolean {
        return this._chain.getEventHash('Scheduler.Scheduled') === '4186e24556a58b04e04d6d697a530eedf78f255da1ba9d84df6511dd6d6465f7'
    }

    /**
     * Scheduled some task.
     */
    get asV43(): {when: number, index: number} {
        assert(this.isV43)
        return this._chain.decodeEvent(this.event)
    }
}

export class TokenManagerAvtLiftedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TokenManager.AVTLifted')
        this._chain = ctx._chain
        this.event = event
    }

    get isV4(): boolean {
        return this._chain.getEventHash('TokenManager.AVTLifted') === 'e9ef27630e2e9f398ac982c3d290753e4160262a34b12e6c4ff4f8d3985e6571'
    }

    get asV4(): {recipient: Uint8Array, amount: bigint, ethTxHash: Uint8Array} {
        assert(this.isV4)
        return this._chain.decodeEvent(this.event)
    }
}

export class TokenManagerAvtLoweredEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TokenManager.AvtLowered')
        this._chain = ctx._chain
        this.event = event
    }

    get isV51(): boolean {
        return this._chain.getEventHash('TokenManager.AvtLowered') === '970149ac9ba4e3bd551be3cd445c6d4e241055bd9dca7ccc42ef81042f061a0b'
    }

    get asV51(): {sender: Uint8Array, recipient: Uint8Array, amount: bigint, t1Recipient: Uint8Array} {
        assert(this.isV51)
        return this._chain.decodeEvent(this.event)
    }

    get isV56(): boolean {
        return this._chain.getEventHash('TokenManager.AvtLowered') === '9ec7946287b2369a0a7842510a97a6739e23625a46431d68f0641ef11cdc2525'
    }

    get asV56(): {sender: Uint8Array, recipient: Uint8Array, amount: bigint, t1Recipient: Uint8Array, lowerId: number} {
        assert(this.isV56)
        return this._chain.decodeEvent(this.event)
    }
}

export class TokenManagerLowerRequestedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'TokenManager.LowerRequested')
        this._chain = ctx._chain
        this.event = event
    }

    get isV56(): boolean {
        return this._chain.getEventHash('TokenManager.LowerRequested') === 'd58277472a35d5f5f3dd5adb11404106e2c540170245a204a76c5fe79a9c8967'
    }

    get asV56(): {tokenId: Uint8Array, from: Uint8Array, amount: bigint, t1Recipient: Uint8Array, senderNonce: (bigint | undefined), lowerId: number, scheduleName: Uint8Array} {
        assert(this.isV56)
        return this._chain.decodeEvent(this.event)
    }
}

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

    get isV4(): boolean {
        return this._chain.getEventHash('TokenManager.TokenLifted') === '7dd533a3a175b999163443dec188adc3674f125ef7d3d21a748a2fbff1ac4383'
    }

    get asV4(): {tokenId: Uint8Array, recipient: Uint8Array, tokenBalance: bigint, ethTxHash: Uint8Array} {
        assert(this.isV4)
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

    get isV4(): boolean {
        return this._chain.getEventHash('TokenManager.TokenLowered') === '9b7941fc00100a31ce3a201b3eaedbc4c7ffa2315fecdd973f5a4d82b6cfc711'
    }

    get asV4(): {tokenId: Uint8Array, sender: Uint8Array, recipient: Uint8Array, amount: bigint, t1Recipient: Uint8Array} {
        assert(this.isV4)
        return this._chain.decodeEvent(this.event)
    }

    get isV56(): boolean {
        return this._chain.getEventHash('TokenManager.TokenLowered') === '9569ef92ccde6c2b9f0e7f72a9efbee0dd23f8162ddd5073794481026018379b'
    }

    get asV56(): {tokenId: Uint8Array, sender: Uint8Array, recipient: Uint8Array, amount: bigint, t1Recipient: Uint8Array, lowerId: number} {
        assert(this.isV56)
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

    get isV4(): boolean {
        return this._chain.getEventHash('TokenManager.TokenTransferred') === '3c9c9f3ffd7d493dd03ff2241837214e10d0709653e219534e8798365aed9672'
    }

    get asV4(): {tokenId: Uint8Array, sender: Uint8Array, recipient: Uint8Array, tokenBalance: bigint} {
        assert(this.isV4)
        return this._chain.decodeEvent(this.event)
    }
}
