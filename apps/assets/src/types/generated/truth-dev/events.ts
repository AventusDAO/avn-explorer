import assert from 'assert'
import {Chain, ChainContext, EventContext, Event, Result, Option} from './support'
import * as v3 from './v3'

export class AssetRegistryRegisteredAssetEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'AssetRegistry.RegisteredAsset')
        this._chain = ctx._chain
        this.event = event
    }

    get isV3(): boolean {
        return this._chain.getEventHash('AssetRegistry.RegisteredAsset') === '172299e8f3292bf90029b6bbb735281d97d0891cf675995c8c13f35e8205b19c'
    }

    get asV3(): {assetId: v3.Asset, metadata: v3.AssetMetadata} {
        assert(this.isV3)
        return this._chain.decodeEvent(this.event)
    }
}

export class AssetRegistryUpdatedAssetEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'AssetRegistry.UpdatedAsset')
        this._chain = ctx._chain
        this.event = event
    }

    get isV3(): boolean {
        return this._chain.getEventHash('AssetRegistry.UpdatedAsset') === '172299e8f3292bf90029b6bbb735281d97d0891cf675995c8c13f35e8205b19c'
    }

    get asV3(): {assetId: v3.Asset, metadata: v3.AssetMetadata} {
        assert(this.isV3)
        return this._chain.decodeEvent(this.event)
    }
}

export class TokensBalanceSetEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Tokens.BalanceSet')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * A balance was set by root.
     */
    get isV3(): boolean {
        return this._chain.getEventHash('Tokens.BalanceSet') === 'e7d90e55788c51bd03a9edc8346cec536976740023edcafe7db4720bb27f5ceb'
    }

    /**
     * A balance was set by root.
     */
    get asV3(): {currencyId: v3.Asset, who: Uint8Array, free: bigint, reserved: bigint} {
        assert(this.isV3)
        return this._chain.decodeEvent(this.event)
    }
}

export class TokensDepositedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Tokens.Deposited')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Deposited some balance into an account
     */
    get isV3(): boolean {
        return this._chain.getEventHash('Tokens.Deposited') === '6d2945f0e144291eb22374605cf3a7d433a84c198c2ddc3fff32d9a44b842d5d'
    }

    /**
     * Deposited some balance into an account
     */
    get asV3(): {currencyId: v3.Asset, who: Uint8Array, amount: bigint} {
        assert(this.isV3)
        return this._chain.decodeEvent(this.event)
    }
}

export class TokensDustLostEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Tokens.DustLost')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * An account was removed whose balance was non-zero but below
     * ExistentialDeposit, resulting in an outright loss.
     */
    get isV3(): boolean {
        return this._chain.getEventHash('Tokens.DustLost') === '6d2945f0e144291eb22374605cf3a7d433a84c198c2ddc3fff32d9a44b842d5d'
    }

    /**
     * An account was removed whose balance was non-zero but below
     * ExistentialDeposit, resulting in an outright loss.
     */
    get asV3(): {currencyId: v3.Asset, who: Uint8Array, amount: bigint} {
        assert(this.isV3)
        return this._chain.decodeEvent(this.event)
    }
}

export class TokensEndowedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Tokens.Endowed')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * An account was created with some free balance.
     */
    get isV3(): boolean {
        return this._chain.getEventHash('Tokens.Endowed') === '6d2945f0e144291eb22374605cf3a7d433a84c198c2ddc3fff32d9a44b842d5d'
    }

    /**
     * An account was created with some free balance.
     */
    get asV3(): {currencyId: v3.Asset, who: Uint8Array, amount: bigint} {
        assert(this.isV3)
        return this._chain.decodeEvent(this.event)
    }
}

export class TokensIssuedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Tokens.Issued')
        this._chain = ctx._chain
        this.event = event
    }

    get isV3(): boolean {
        return this._chain.getEventHash('Tokens.Issued') === '40d5caeb40431a988f1ef8ea09cfba4fcff3b722c36d2aaee4d047fc658898be'
    }

    get asV3(): {currencyId: v3.Asset, amount: bigint} {
        assert(this.isV3)
        return this._chain.decodeEvent(this.event)
    }
}

export class TokensLockRemovedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Tokens.LockRemoved')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Some locked funds were unlocked
     */
    get isV3(): boolean {
        return this._chain.getEventHash('Tokens.LockRemoved') === 'e72475a1e69d754ed9c9cdc667fa65df46c00ae03c880146fe10d3e730dd2383'
    }

    /**
     * Some locked funds were unlocked
     */
    get asV3(): {lockId: Uint8Array, currencyId: v3.Asset, who: Uint8Array} {
        assert(this.isV3)
        return this._chain.decodeEvent(this.event)
    }
}

export class TokensLockSetEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Tokens.LockSet')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Some funds are locked
     */
    get isV3(): boolean {
        return this._chain.getEventHash('Tokens.LockSet') === 'cda4b385e3c00a30909b09c010691338d8a83b8ac0be49409f47ed2db0610d0e'
    }

    /**
     * Some funds are locked
     */
    get asV3(): {lockId: Uint8Array, currencyId: v3.Asset, who: Uint8Array, amount: bigint} {
        assert(this.isV3)
        return this._chain.decodeEvent(this.event)
    }
}

export class TokensLockedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Tokens.Locked')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Some free balance was locked.
     */
    get isV3(): boolean {
        return this._chain.getEventHash('Tokens.Locked') === '6d2945f0e144291eb22374605cf3a7d433a84c198c2ddc3fff32d9a44b842d5d'
    }

    /**
     * Some free balance was locked.
     */
    get asV3(): {currencyId: v3.Asset, who: Uint8Array, amount: bigint} {
        assert(this.isV3)
        return this._chain.decodeEvent(this.event)
    }
}

export class TokensRescindedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Tokens.Rescinded')
        this._chain = ctx._chain
        this.event = event
    }

    get isV3(): boolean {
        return this._chain.getEventHash('Tokens.Rescinded') === '40d5caeb40431a988f1ef8ea09cfba4fcff3b722c36d2aaee4d047fc658898be'
    }

    get asV3(): {currencyId: v3.Asset, amount: bigint} {
        assert(this.isV3)
        return this._chain.decodeEvent(this.event)
    }
}

export class TokensReserveRepatriatedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Tokens.ReserveRepatriated')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Some reserved balance was repatriated (moved from reserved to
     * another account).
     */
    get isV3(): boolean {
        return this._chain.getEventHash('Tokens.ReserveRepatriated') === 'bc6dedf048909afc0f76f7d63821a053e29731967f1e73d9784eb862942c59d2'
    }

    /**
     * Some reserved balance was repatriated (moved from reserved to
     * another account).
     */
    get asV3(): {currencyId: v3.Asset, from: Uint8Array, to: Uint8Array, amount: bigint, status: v3.BalanceStatus} {
        assert(this.isV3)
        return this._chain.decodeEvent(this.event)
    }
}

export class TokensReservedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Tokens.Reserved')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Some balance was reserved (moved from free to reserved).
     */
    get isV3(): boolean {
        return this._chain.getEventHash('Tokens.Reserved') === '6d2945f0e144291eb22374605cf3a7d433a84c198c2ddc3fff32d9a44b842d5d'
    }

    /**
     * Some balance was reserved (moved from free to reserved).
     */
    get asV3(): {currencyId: v3.Asset, who: Uint8Array, amount: bigint} {
        assert(this.isV3)
        return this._chain.decodeEvent(this.event)
    }
}

export class TokensSlashedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Tokens.Slashed')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Some balances were slashed (e.g. due to mis-behavior)
     */
    get isV3(): boolean {
        return this._chain.getEventHash('Tokens.Slashed') === 'cc5fb9aeb796cad6ffde4fb1d780ce91b6bedd454fe7b0b87c232e93043d8df4'
    }

    /**
     * Some balances were slashed (e.g. due to mis-behavior)
     */
    get asV3(): {currencyId: v3.Asset, who: Uint8Array, freeAmount: bigint, reservedAmount: bigint} {
        assert(this.isV3)
        return this._chain.decodeEvent(this.event)
    }
}

export class TokensTotalIssuanceSetEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Tokens.TotalIssuanceSet')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * The total issuance of an currency has been set
     */
    get isV3(): boolean {
        return this._chain.getEventHash('Tokens.TotalIssuanceSet') === '40d5caeb40431a988f1ef8ea09cfba4fcff3b722c36d2aaee4d047fc658898be'
    }

    /**
     * The total issuance of an currency has been set
     */
    get asV3(): {currencyId: v3.Asset, amount: bigint} {
        assert(this.isV3)
        return this._chain.decodeEvent(this.event)
    }
}

export class TokensTransferEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Tokens.Transfer')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Transfer succeeded.
     */
    get isV3(): boolean {
        return this._chain.getEventHash('Tokens.Transfer') === '2491e68234d384eebe51b268b03774688ec8aa4c0e2af8cefb8872713c2faf88'
    }

    /**
     * Transfer succeeded.
     */
    get asV3(): {currencyId: v3.Asset, from: Uint8Array, to: Uint8Array, amount: bigint} {
        assert(this.isV3)
        return this._chain.decodeEvent(this.event)
    }
}

export class TokensUnlockedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Tokens.Unlocked')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Some locked balance was freed.
     */
    get isV3(): boolean {
        return this._chain.getEventHash('Tokens.Unlocked') === '6d2945f0e144291eb22374605cf3a7d433a84c198c2ddc3fff32d9a44b842d5d'
    }

    /**
     * Some locked balance was freed.
     */
    get asV3(): {currencyId: v3.Asset, who: Uint8Array, amount: bigint} {
        assert(this.isV3)
        return this._chain.decodeEvent(this.event)
    }
}

export class TokensUnreservedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Tokens.Unreserved')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Some balance was unreserved (moved from reserved to free).
     */
    get isV3(): boolean {
        return this._chain.getEventHash('Tokens.Unreserved') === '6d2945f0e144291eb22374605cf3a7d433a84c198c2ddc3fff32d9a44b842d5d'
    }

    /**
     * Some balance was unreserved (moved from reserved to free).
     */
    get asV3(): {currencyId: v3.Asset, who: Uint8Array, amount: bigint} {
        assert(this.isV3)
        return this._chain.decodeEvent(this.event)
    }
}

export class TokensWithdrawnEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Tokens.Withdrawn')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     * Some balances were withdrawn (e.g. pay for transaction fee)
     */
    get isV3(): boolean {
        return this._chain.getEventHash('Tokens.Withdrawn') === '6d2945f0e144291eb22374605cf3a7d433a84c198c2ddc3fff32d9a44b842d5d'
    }

    /**
     * Some balances were withdrawn (e.g. pay for transaction fee)
     */
    get asV3(): {currencyId: v3.Asset, who: Uint8Array, amount: bigint} {
        assert(this.isV3)
        return this._chain.decodeEvent(this.event)
    }
}
