import assert from 'assert'
import { Chain, ChainContext, EventContext, Event, Result, Option } from './support'
import * as v21 from './v21'

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
  get isV21(): boolean {
    return (
      this._chain.getEventHash('Balances.Transfer') ===
      '0ffdf35c495114c2d42a8bf6c241483fd5334ca0198662e14480ad040f1e3a66'
    )
  }

  /**
   * Transfer succeeded.
   */
  get asV21(): { from: Uint8Array; to: Uint8Array; amount: bigint } {
    assert(this.isV21)
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
  get isV21(): boolean {
    return (
      this._chain.getEventHash('NftManager.BatchCreated') ===
      '444e53a57d5de1115824210f79cf5345f22358b98591752e1535bd55f64323b0'
    )
  }

  /**
   * batch_id, total_supply, batch_creator, provenance
   */
  get asV21(): {
    batchNftId: bigint
    totalSupply: bigint
    batchCreator: Uint8Array
    authority: Uint8Array
  } {
    assert(this.isV21)
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
  get isV21(): boolean {
    return (
      this._chain.getEventHash('NftManager.BatchNftMinted') ===
      'bf4ed2bc6db2a7504923460bf9705d47128ea6791caacbabaaac33ee10900201'
    )
  }

  /**
   * nft_id, batch_id, provenance, owner
   */
  get asV21(): { nftId: bigint; batchNftId: bigint; authority: Uint8Array; owner: Uint8Array } {
    assert(this.isV21)
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
  get isV21(): boolean {
    return (
      this._chain.getEventHash('NftManager.FiatNftTransfer') ===
      'bcc234ffdff6ace39dad4bcb0d4beab866926c346d9b4225c47099b247afde9b'
    )
  }

  /**
   * FiatNftTransfer(NftId, SenderAccountId, NewOwnerAccountId, NftSaleType, NftNonce)
   */
  get asV21(): {
    nftId: bigint
    sender: Uint8Array
    newOwner: Uint8Array
    saleType: v21.NftSaleType
    opId: bigint
  } {
    assert(this.isV21)
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

  get isV21(): boolean {
    return (
      this._chain.getEventHash('NftManager.SingleNftMinted') ===
      'a8e7b268852ec5761965291c86ad84fac0a165d047bc18e80d75b181e281cc41'
    )
  }

  get asV21(): { nftId: bigint; owner: Uint8Array; authority: Uint8Array } {
    assert(this.isV21)
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

  get isV21(): boolean {
    return (
      this._chain.getEventHash('TokenManager.TokenLifted') ===
      '7dd533a3a175b999163443dec188adc3674f125ef7d3d21a748a2fbff1ac4383'
    )
  }

  get asV21(): {
    tokenId: Uint8Array
    recipient: Uint8Array
    tokenBalance: bigint
    ethTxHash: Uint8Array
  } {
    assert(this.isV21)
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

  get isV21(): boolean {
    return (
      this._chain.getEventHash('TokenManager.TokenLowered') ===
      '9b7941fc00100a31ce3a201b3eaedbc4c7ffa2315fecdd973f5a4d82b6cfc711'
    )
  }

  get asV21(): {
    tokenId: Uint8Array
    sender: Uint8Array
    recipient: Uint8Array
    amount: bigint
    t1Recipient: Uint8Array
  } {
    assert(this.isV21)
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

  get isV21(): boolean {
    return (
      this._chain.getEventHash('TokenManager.TokenTransferred') ===
      '3c9c9f3ffd7d493dd03ff2241837214e10d0709653e219534e8798365aed9672'
    )
  }

  get asV21(): {
    tokenId: Uint8Array
    sender: Uint8Array
    recipient: Uint8Array
    tokenBalance: bigint
  } {
    assert(this.isV21)
    return this._chain.decodeEvent(this.event)
  }
}
