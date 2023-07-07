import assert from 'assert'
import { Block, BlockContext, Chain, ChainContext, Option, Result, StorageBase } from './support'
import * as v12 from './v12'

export class ParachainStakingNominatorStateStorage extends StorageBase {
  protected getPrefix() {
    return 'ParachainStaking'
  }

  protected getName() {
    return 'NominatorState'
  }

  /**
   *  Get nominator state associated with an account if account is nominating else None
   */
  get isV12(): boolean {
    return this.getTypeHash() === '1c202ee2b387e76b12a61cfe4a3f557431cd1902af95841b0b3ee6ab3747befe'
  }

  /**
   *  Get nominator state associated with an account if account is nominating else None
   */
  get asV12(): ParachainStakingNominatorStateStorageV12 {
    assert(this.isV12)
    return this as any
  }
}

/**
 *  Get nominator state associated with an account if account is nominating else None
 */
export interface ParachainStakingNominatorStateStorageV12 {
  get(key: Uint8Array): Promise<v12.Nominator | undefined>
  getAll(): Promise<v12.Nominator[]>
  getMany(keys: Uint8Array[]): Promise<(v12.Nominator | undefined)[]>
  getKeys(): Promise<Uint8Array[]>
  getKeys(key: Uint8Array): Promise<Uint8Array[]>
  getKeysPaged(pageSize: number): AsyncIterable<Uint8Array[]>
  getKeysPaged(pageSize: number, key: Uint8Array): AsyncIterable<Uint8Array[]>
  getPairs(): Promise<[k: Uint8Array, v: v12.Nominator][]>
  getPairs(key: Uint8Array): Promise<[k: Uint8Array, v: v12.Nominator][]>
  getPairsPaged(pageSize: number): AsyncIterable<[k: Uint8Array, v: v12.Nominator][]>
  getPairsPaged(
    pageSize: number,
    key: Uint8Array
  ): AsyncIterable<[k: Uint8Array, v: v12.Nominator][]>
}
