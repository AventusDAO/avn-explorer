import assert from 'assert'
import {Chain, ChainContext, EventContext, Event, Result, Option} from './support'
import * as v21 from './v21'
import * as v24 from './v24'

export class AvnProxyInnerCallFailedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'AvnProxy.InnerCallFailed')
    this._chain = ctx._chain
    this.event = event
  }

  get isV21(): boolean {
    return (
      this._chain.getEventHash('AvnProxy.InnerCallFailed') ===
      '7af74f1c229c2a351c1a1a739b900af2968c26804b61e6b4400feb569c20707d'
    )
  }

  get asV21(): { relayer: Uint8Array; hash: Uint8Array; dispatchError: v21.DispatchError } {
    assert(this.isV21)
    return this._chain.decodeEvent(this.event)
  }

  get isV24(): boolean {
    return (
      this._chain.getEventHash('AvnProxy.InnerCallFailed') ===
      'f2b40240a71eca1fca6e989be5f4d47d5004f64256bbf9973550a20f6ffb20f7'
    )
  }

  get asV24(): { relayer: Uint8Array; hash: Uint8Array; dispatchError: v24.DispatchError } {
    assert(this.isV24)
    return this._chain.decodeEvent(this.event)
  }
}

export class SystemExtrinsicFailedEvent {
  private readonly _chain: Chain
  private readonly event: Event

  constructor(ctx: EventContext)
  constructor(ctx: ChainContext, event: Event)
  constructor(ctx: EventContext, event?: Event) {
    event = event || ctx.event
    assert(event.name === 'System.ExtrinsicFailed')
    this._chain = ctx._chain
    this.event = event
  }

  /**
   * An extrinsic failed.
   */
  get isV21(): boolean {
    return (
      this._chain.getEventHash('System.ExtrinsicFailed') ===
      'a6220584fa4f22cb02db1bfad4eacf1a689aea2324f22b4763def7376b7dd9bf'
    )
  }

  /**
   * An extrinsic failed.
   */
  get asV21(): { dispatchError: v21.DispatchError; dispatchInfo: v21.DispatchInfo } {
    assert(this.isV21)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * An extrinsic failed.
   */
  get isV24(): boolean {
    return (
      this._chain.getEventHash('System.ExtrinsicFailed') ===
      '36c29895cd15b6f845bb064a671635ce07ef9de9648695c2803020e8510d0fb3'
    )
  }

  /**
   * An extrinsic failed.
   */
  get asV24(): { dispatchError: v24.DispatchError; dispatchInfo: v24.DispatchInfo } {
    assert(this.isV24)
    return this._chain.decodeEvent(this.event)
  }
}
