import assert from 'assert'
import { Chain, ChainContext, EventContext, Event, Result, Option } from './support'
import * as v4 from './v4'

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
    return (
      this._chain.getEventHash('Balances.BalanceSet') ===
      '1e2b5d5a07046e6d6e5507661d3f3feaddfb41fc609a2336b24957322080ca77'
    )
  }

  /**
   * A balance was set by root.
   */
  get asV4(): { who: Uint8Array; free: bigint; reserved: bigint } {
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
    return (
      this._chain.getEventHash('Balances.Deposit') ===
      'e84a34a6a3d577b31f16557bd304282f4fe4cbd7115377f4687635dc48e52ba5'
    )
  }

  /**
   * Some amount was deposited (e.g. for transaction fees).
   */
  get asV4(): { who: Uint8Array; amount: bigint } {
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
    return (
      this._chain.getEventHash('Balances.Endowed') ===
      '75951f685df19cbb5fdda09cf928a105518ceca9576d95bd18d4fac8802730ca'
    )
  }

  /**
   * An account was created with some free balance.
   */
  get asV4(): { account: Uint8Array; freeBalance: bigint } {
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
    return (
      this._chain.getEventHash('Balances.ReserveRepatriated') ===
      '6232d50d422cea3a6fd21da36387df36d1d366405d0c589566c6de85c9cf541f'
    )
  }

  /**
   * Some balance was moved from the reserve of the first account to the second account.
   * Final argument indicates the destination balance type.
   */
  get asV4(): {
    from: Uint8Array
    to: Uint8Array
    amount: bigint
    destinationStatus: v4.BalanceStatus
  } {
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
    return (
      this._chain.getEventHash('Balances.Reserved') ===
      'e84a34a6a3d577b31f16557bd304282f4fe4cbd7115377f4687635dc48e52ba5'
    )
  }

  /**
   * Some balance was reserved (moved from free to reserved).
   */
  get asV4(): { who: Uint8Array; amount: bigint } {
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
    return (
      this._chain.getEventHash('Balances.Slashed') ===
      'e84a34a6a3d577b31f16557bd304282f4fe4cbd7115377f4687635dc48e52ba5'
    )
  }

  /**
   * Some amount was removed from the account (e.g. for misbehavior).
   */
  get asV4(): { who: Uint8Array; amount: bigint } {
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
    return (
      this._chain.getEventHash('Balances.Transfer') ===
      '0ffdf35c495114c2d42a8bf6c241483fd5334ca0198662e14480ad040f1e3a66'
    )
  }

  /**
   * Transfer succeeded.
   */
  get asV4(): { from: Uint8Array; to: Uint8Array; amount: bigint } {
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
    return (
      this._chain.getEventHash('Balances.Unreserved') ===
      'e84a34a6a3d577b31f16557bd304282f4fe4cbd7115377f4687635dc48e52ba5'
    )
  }

  /**
   * Some balance was unreserved (moved from reserved to free).
   */
  get asV4(): { who: Uint8Array; amount: bigint } {
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
    return (
      this._chain.getEventHash('Balances.Withdraw') ===
      'e84a34a6a3d577b31f16557bd304282f4fe4cbd7115377f4687635dc48e52ba5'
    )
  }

  /**
   * Some amount was withdrawn from the account (e.g. for transaction fees).
   */
  get asV4(): { who: Uint8Array; amount: bigint } {
    assert(this.isV4)
    return this._chain.decodeEvent(this.event)
  }
}

export class MigrationMigratedSystemAccountsEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Migration.MigratedSystemAccounts')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * Number of accounts that have been migrated
   */
  get isV4(): boolean {
    return (
      this._chain.getEventHash('Migration.MigratedSystemAccounts') ===
      '0a0f30b1ade5af5fade6413c605719d59be71340cf4884f65ee9858eb1c38f6c'
    )
  }

  /**
   * Number of accounts that have been migrated
   */
  get asV4(): number {
    assert(this.isV4)
    return this._chain.decodeEvent(this.event)
  }
}

export class MigrationMigratedTotalIssuanceEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'Migration.MigratedTotalIssuance')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * The new and the old issuance after the migration of issuance.
   * [`OldIssuance`, `NewIssuance`]
   */
  get isV4(): boolean {
    return (
      this._chain.getEventHash('Migration.MigratedTotalIssuance') ===
      'f7d5bd1431cb954502149f64a8137986d660e0729a3d9731d421496b4298be52'
    )
  }

  /**
   * The new and the old issuance after the migration of issuance.
   * [`OldIssuance`, `NewIssuance`]
   */
  get asV4(): [bigint, bigint] {
    assert(this.isV4)
    return this._chain.decodeEvent(this.event)
  }
}
