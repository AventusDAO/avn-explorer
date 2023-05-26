import assert from 'assert'
import { Chain, ChainContext, EventContext, Event, Result, Option } from './support'
import * as v4 from './v4'
import * as v21 from './v21'
import * as v27 from './v27'

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

  get isV27(): boolean {
    return (
      this._chain.getEventHash('AvnProxy.InnerCallFailed') ===
      'f2b40240a71eca1fca6e989be5f4d47d5004f64256bbf9973550a20f6ffb20f7'
    )
  }

  get asV27(): { relayer: Uint8Array; hash: Uint8Array; dispatchError: v27.DispatchError } {
    assert(this.isV27)
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
  get isV4(): boolean {
    return (
      this._chain.getEventHash('System.ExtrinsicFailed') ===
      'a6220584fa4f22cb02db1bfad4eacf1a689aea2324f22b4763def7376b7dd9bf'
    )
  }

  /**
   * An extrinsic failed.
   */
  get asV4(): { dispatchError: v4.DispatchError; dispatchInfo: v4.DispatchInfo } {
    assert(this.isV4)
    return this._chain.decodeEvent(this.event)
  }

  /**
   * An extrinsic failed.
   */
  get isV27(): boolean {
    return (
      this._chain.getEventHash('System.ExtrinsicFailed') ===
      '36c29895cd15b6f845bb064a671635ce07ef9de9648695c2803020e8510d0fb3'
    )
  }

  /**
   * An extrinsic failed.
   */
  get asV27(): { dispatchError: v27.DispatchError; dispatchInfo: v27.DispatchInfo } {
    assert(this.isV27)
    return this._chain.decodeEvent(this.event)
  }
}
