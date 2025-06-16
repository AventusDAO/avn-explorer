import {
  BatchContext,
  BatchProcessorEventItem,
  BatchProcessorItem,
  SubstrateBlock
} from '@subsquid/substrate-processor'
import {
  TokensAccountsStorage,
} from './types/generated/truth-testnet/storage'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import { getProcessor } from '@avn/config'
import { randomUUID } from 'crypto'

import { Asset as AssetModel, Balance } from './model'
import {
  getDataFromEndowedEvent,
  getDataFromBalanceSetEvent,
  getDataFromDustLostEvent,
  getDataFromUnreservedEvent,
  getDataFromReservedEvent,
  getDataFromWithdrawnEvent,
  getDataFromSlashedEvent,
  getDataFromDepositedEvent,
  getDataFromLockSetEvent,
  getDataFromLockRemovedEvent,
  getDataFromLockedEvent,
  getDataFromTransferEvent,
  getDataFromReserveRepatriatedEvent,
  getDataFromUnlockedEvent,
  ExtractedData,
  getDataFromAssetRegisteredEvent,
  getDataFromAssetUpdatedEvent
} from './eventHandlers'
import {
  Asset,
  Asset_ForeignAsset,
  Type_440
} from './types/generated/truth-testnet/v3'
import { u8aToHex } from '@polkadot/util'

const processor = getProcessor()
  .addEvent('Tokens.Endowed', {
    data: { event: { args: true } }
  } as const)
  .addEvent('Tokens.DustLost', {
    data: { event: { args: true } }
  } as const)
  .addEvent('Tokens.Transfer', {
    data: { event: { args: true } }
  } as const)
  .addEvent('Tokens.Reserved', {
    data: { event: { args: true } }
  } as const)
  .addEvent('Tokens.Unreserved', {
    data: { event: { args: true } }
  } as const)
  .addEvent('Tokens.ReserveRepatriated', {
    data: { event: { args: true } }
  } as const)
  .addEvent('Tokens.BalanceSet', {
    data: { event: { args: true } }
  } as const)
  .addEvent('Tokens.Withdrawn', {
    data: { event: { args: true } }
  } as const)
  .addEvent('Tokens.Slashed', {
    data: { event: { args: true } }
  } as const)
  .addEvent('Tokens.Deposited', {
    data: { event: { args: true } }
  } as const)
  .addEvent('Tokens.LockSet', {
    data: { event: { args: true } }
  } as const)
  .addEvent('Tokens.LockRemoved', {
    data: { event: { args: true } }
  } as const)
  .addEvent('Tokens.Locked', {
    data: { event: { args: true } }
  } as const)
  .addEvent('Tokens.Unlocked', {
    data: { event: { args: true } }
  } as const)
  .addEvent('AssetRegistry.RegisteredAsset', {
    data: { event: { args: true } }
  } as const)
  .addEvent('AssetRegistry.UpdatedAsset', {
    data: { event: { args: true } }
  } as const)

type Item = BatchProcessorItem<typeof processor>
type EventItem = BatchProcessorEventItem<typeof processor>
type Context = BatchContext<Store, Item>

async function main(ctx: Context): Promise<void> {
  const balances: Balance[] = []

  for (const block of ctx.blocks) {
    for (const item of block.items) {
      if (item.kind === 'event') {
        switch (item.name) {
          case 'AssetRegistry.RegisteredAsset':
            const asset: AssetModel | undefined = getDataFromAssetRegisteredEvent(ctx, item.event)
            if (asset) {
              await ctx.store.save<AssetModel>(asset)
            }

            break
          case 'AssetRegistry.UpdatedAsset': {
            const asset = getDataFromAssetUpdatedEvent(ctx, item.event)
            if (asset) {
              await ctx.store.save(asset)
            }

            break
          }
          default: {
            const result = await processAssetBalanceEventItem(ctx, item, block.header)
            if (result && result.length > 0) {
              balances.push(...result)
            }
            break
          }
        }
      }
    }
  }

  await ctx.store.save(balances)
  ctx.log.child('assets').debug(`saved ${balances.length} balances`)
}

async function processAssetBalanceEventItem(
  ctx: Context,
  item: EventItem,
  block: SubstrateBlock
): Promise<Balance[] | undefined> {
  const eventData = getEventData(ctx, item, block)
  if (!eventData) return undefined

  return await Promise.all(
    eventData.map(async data => {
      // get the balance for of the asset
      const balance = await getAssetBalance(ctx, block, data.currency, data.account)
      const asset = await getAsset(ctx, block, data.currency)
      return new Balance({
        id: randomUUID(),
        account: u8aToHex(data.account),
        free: balance.free,
        reserved: balance.reserved,
        asset,
        updatedAt: BigInt(block.height)
      })
    })
  )
}

async function getAssetBalance(
  ctx: Context,
  block: SubstrateBlock,
  assetId: Asset,
  accountId: Uint8Array
): Promise<Type_440> {
  const storage = new TokensAccountsStorage(ctx, block)
  return await storage.asV3.get(accountId, assetId)
}

async function getAsset(
  ctx: Context,
  block: SubstrateBlock,
  assetId: Asset
): Promise<AssetModel | undefined> {
  return await ctx.store.get(AssetModel, `ForeignAsset-${(assetId as Asset_ForeignAsset).value}`)
}

function getEventData(
  ctx: Context,
  item: EventItem,
  block: SubstrateBlock
): ExtractedData[] | undefined {
  switch (item.name) {
    case 'Tokens.Endowed': {
      const result = getDataFromEndowedEvent(ctx, item.event)
      return result ? [result] : undefined
    }
    case 'Tokens.DustLost': {
      const result = getDataFromDustLostEvent(ctx, item.event)
      return result ? [result] : undefined
    }
    case 'Tokens.Transfer': {
      const result = getDataFromTransferEvent(ctx, item.event)
      return result || undefined
    }
    case 'Tokens.Reserved': {
      const result = getDataFromReservedEvent(ctx, item.event)
      return result ? [result] : undefined
    }
    case 'Tokens.Unreserved': {
      const result = getDataFromUnreservedEvent(ctx, item.event)
      return result ? [result] : undefined
    }
    case 'Tokens.ReserveRepatriated': {
      const result = getDataFromReserveRepatriatedEvent(ctx, item.event)
      return result || undefined
    }
    case 'Tokens.BalanceSet': {
      const result = getDataFromBalanceSetEvent(ctx, item.event)
      return result ? [result] : undefined
    }
    case 'Tokens.Withdrawn': {
      const result = getDataFromWithdrawnEvent(ctx, item.event)
      return result ? [result] : undefined
    }
    case 'Tokens.Slashed': {
      const result = getDataFromSlashedEvent(ctx, item.event)
      return result ? [result] : undefined
    }
    case 'Tokens.Deposited': {
      const result = getDataFromDepositedEvent(ctx, item.event)
      return result ? [result] : undefined
    }
    case 'Tokens.LockSet': {
      const result = getDataFromLockSetEvent(ctx, item.event)
      return result ? [result] : undefined
    }
    case 'Tokens.LockRemoved': {
      const result = getDataFromLockRemovedEvent(ctx, item.event)
      return result ? [result] : undefined
    }
    case 'Tokens.Locked': {
      const result = getDataFromLockedEvent(ctx, item.event)
      return result ? [result] : undefined
    }
    case 'Tokens.Unlocked': {
      const result = getDataFromUnlockedEvent(ctx, item.event)
      return result ? [result] : undefined
    }
  }
  return undefined
}

processor.run(new TypeormDatabase(), main)
