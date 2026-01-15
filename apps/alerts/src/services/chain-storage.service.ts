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

type QueueStorageHandler = (ctx: ChainContext, block: Block) => Promise<number | undefined>

export class ChainStorageService {
  /**
   * Registry of typed queue storage handlers.
   * Add new queues here when you need type-safe version checking.
   * Queues not in this registry will use the generic fallback.
   */
  private readonly queueHandlers: Map<string, QueueStorageHandler> = new Map([
    ['EthBridge.RequestQueue', this.getEthBridgeRequestQueueCount.bind(this)]
  ])
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
    const queueKey = `${storagePrefix}.${storageName}`
    const typedHandler = this.queueHandlers.get(queueKey)

    try {
      // Use typed handler if available (provides version checking and type safety)
      if (typedHandler) {
        return await typedHandler(ctx, block)
      }

      // Generic fallback for queues without typed handlers
      return await this.getGenericQueueCount(ctx, block, storagePrefix, storageName)
    } catch (error) {
      return undefined
    }
  }

  private async getEthBridgeRequestQueueCount(
    ctx: ChainContext,
    block: Block
  ): Promise<number | undefined> {
    const storage = new EthBridgeRequestQueueStorage(ctx, block)
    if (!storage.isExists) {
      return undefined
    }

    if (storage.isV58) {
      const queue = await storage.asV58.get()
      return queue?.length ?? 0
    }

    throw new UnknownVersionError('EthBridgeRequestQueueStorage')
  }

  private async getGenericQueueCount(
    ctx: ChainContext,
    block: Block,
    storagePrefix: string,
    storageName: string
  ): Promise<number | undefined> {
    const storage = await ctx._chain.getStorage(block.hash, storagePrefix, storageName)

    if (!storage) {
      return undefined
    }

    if (Array.isArray(storage)) {
      return storage.length
    }

    if (typeof storage === 'object' && 'length' in storage) {
      return Number(storage.length)
    }

    if (typeof storage === 'number') {
      return storage
    }

    return undefined
  }
}
