import {
  SystemAccountStorage,
  BalancesAccountStorage,
  EthBridgeRequestQueueStorage
} from '../types/generated/parachain-dev/storage'
import { Block, ChainContext } from '../types/generated/parachain-dev/support'
import { UnknownVersionError } from '@avn/types'

export interface IBalance {
  free: bigint
  reserved: bigint
}

export class ChainStorageService {
  async getBalances(
    ctx: ChainContext,
    block: Block,
    accounts: Uint8Array[]
  ): Promise<IBalance[] | undefined> {
    return (
      (await this.getSystemAccountBalances(ctx, block, accounts)) ??
      (await this.getBalancesAccountBalances(ctx, block, accounts))
    )
  }

  private async getBalancesAccountBalances(
    ctx: ChainContext,
    block: Block,
    accounts: Uint8Array[]
  ): Promise<IBalance[] | undefined> {
    const storage = new BalancesAccountStorage(ctx, block)
    if (!storage.isExists) return undefined

    if ('isV58' in storage && storage.isV58) {
      const data = await storage.asV58.getMany(accounts)
      return data.map((d: any) => ({ free: d.free, reserved: d.reserved }))
    } else if ('isV60' in storage && storage.isV60) {
      const data = await storage.asV60.getMany(accounts)
      return data.map((d: any) => ({ free: d.free, reserved: d.reserved }))
    } else {
      throw new UnknownVersionError(`BalancesAccountStorage`)
    }
  }

  private async getSystemAccountBalances(
    ctx: ChainContext,
    block: Block,
    accounts: Uint8Array[]
  ): Promise<IBalance[] | undefined> {
    const storage = new SystemAccountStorage(ctx, block)
    if (!storage.isExists) return undefined

    if ('isV58' in storage && storage.isV58) {
      const data = await storage.asV58.getMany(accounts)
      return data.map((d: any) => ({
        free: d.data.free,
        reserved: d.data.reserved
      })) as IBalance[]
    } else if ('isV60' in storage && storage.isV60) {
      const data = await storage.asV60.getMany(accounts)
      return data.map((d: any) => ({
        free: d.data.free,
        reserved: d.data.reserved
      })) as IBalance[]
    } else {
      throw new UnknownVersionError(`SystemAccountStorage`)
    }
  }

  async getQueueCount(
    ctx: ChainContext,
    block: Block,
    storagePrefix: string,
    storageName: string
  ): Promise<number | undefined> {
    try {
      if (storagePrefix === 'EthBridge' && storageName === 'RequestQueue') {
        const storage = new EthBridgeRequestQueueStorage(ctx, block)
        if (!storage.isExists) {
          return undefined
        }

        if ('isV58' in storage && storage.isV58) {
          const queue = await storage.asV58.get()
          if (!queue) {
            return 0 // Queue exists but is empty
          }
          return Array.isArray(queue) ? queue.length : 0
        }

        throw new UnknownVersionError(`EthBridgeRequestQueueStorage`)
      }

      const storage = await ctx._chain.getStorage(block.hash, storagePrefix, storageName)

      if (!storage) {
        return undefined
      }

      if (Array.isArray(storage)) {
        return storage.length
      }

      if (storage && typeof storage === 'object' && 'length' in storage) {
        return Number(storage.length)
      }

      if (typeof storage === 'number') {
        return storage
      }

      return undefined
    } catch (error) {
      return undefined
    }
  }
}
