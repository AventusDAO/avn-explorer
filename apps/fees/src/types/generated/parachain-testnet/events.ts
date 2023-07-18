import assert from 'assert'
import { Chain, ChainContext, EventContext, Event, Result, Option } from './support'

export class AvnTransactionPaymentAdjustedTransactionFeePaidEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'AvnTransactionPayment.AdjustedTransactionFeePaid')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * An adjusted transaction fee of `fee` has been paid by `who`
   */
  get isV30(): boolean {
    return (
      this._chain.getEventHash('AvnTransactionPayment.AdjustedTransactionFeePaid') ===
      'cbc2cea47d8d68f4ae7e005449b51d0fee4fa8a65fcd3f3f05db03dd96949c81'
    )
  }

  /**
   * An adjusted transaction fee of `fee` has been paid by `who`
   */
  get asV30(): { who: Uint8Array; fee: bigint } {
    assert(this.isV30)
    return this._chain.decodeEvent(this.event)
  }
}

export class TransactionPaymentTransactionFeePaidEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'TransactionPayment.TransactionFeePaid')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * A transaction fee `actual_fee`, of which `tip` was added to the minimum inclusion fee,
   * has been paid by `who`.
   */
  get isV8(): boolean {
    return (
      this._chain.getEventHash('TransactionPayment.TransactionFeePaid') ===
      'f2e962e9996631445edecd62b0646df79871442a2d1a1a6e1f550a0b3a56b226'
    )
  }

  /**
   * A transaction fee `actual_fee`, of which `tip` was added to the minimum inclusion fee,
   * has been paid by `who`.
   */
  get asV8(): { who: Uint8Array; actualFee: bigint; tip: bigint } {
    assert(this.isV8)
    return this._chain.decodeEvent(this.event)
  }
}
