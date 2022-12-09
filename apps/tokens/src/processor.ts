import {
  BatchContext,
  BatchProcessorCallItem,
  BatchProcessorEventItem,
  BatchProcessorItem,
  SubstrateBlock,
  SubstrateCall,
  decodeHex
} from '@subsquid/substrate-processor'
import { randomUUID } from 'crypto'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import * as ss58 from '@subsquid/ss58'
import { config, getProcessor } from '@avn/config'
import { getTokenLiftedData, getTokenLowerData, getTokenTransferredData } from './eventHandlers'
import { getLastChainState, setChainState } from './service/chainState.service'
import { Block, ChainContext } from './types/generated/parachain-dev/support'
import { TokenManagerBalancesStorage } from './types/generated/parachain-dev/storage'
import { TokenBalanceForAccount } from './model'
import { toHex } from '@subsquid/substrate-processor'

const processor = getProcessor()
  .setBatchSize(config.batchSize ?? 500)
  .setDataSource(config.dataSource)
  .setBlockRange(config.blockRange ?? { from: 0 })
  .addEvent('TokenManager.TokenLifted', {
    data: { event: { args: true } }
  } as const)
  .addEvent('TokenManager.TokenTransferred', {
    data: { event: { args: true } }
  } as const)
  .addEvent('TokenManager.TokenLowered', {
    data: { event: { args: true } }
  } as const)
  .addCall('*', {
    data: { call: { origin: true } }
  } as const)
  .includeAllBlocks()

type Item = BatchProcessorItem<typeof processor>
type EventItem = BatchProcessorEventItem<typeof processor>
type CallItem = BatchProcessorCallItem<typeof processor>
type Context = BatchContext<Store, Item>

processor.run(new TypeormDatabase(), processTokens)

const SAVE_PERIOD = 12 * 60 * 60 * 1000
let lastStateTimestamp: number | undefined

async function processTokens(ctx: Context): Promise<void> {
  const accountIdsHex = new Set<string>()
  const tokenIdsHex = new Set<string>()

  for (const block of ctx.blocks) {
    for (const item of block.items) {
      if (item.kind === 'call') {
        processTokensCallItem(ctx, item, accountIdsHex, tokenIdsHex)
      } else if (item.kind === 'event') {
        processTokensEventItem(ctx, item, accountIdsHex, tokenIdsHex)
      }
    }

    if (lastStateTimestamp == null) {
      lastStateTimestamp = (await getLastChainState(ctx.store))?.timestamp.getTime() ?? 0
    }

    if (block.header.timestamp - lastStateTimestamp! >= SAVE_PERIOD) {
      const accountIds = [...accountIdsHex].map(id => decodeHex(id))
      const tokenIds = [...tokenIdsHex].map(id => decodeHex(id))
    }
  }

  const block = ctx.blocks[ctx.blocks.length - 1]
  const accountIds = [...accountIdsHex].map(id => decodeHex(id))
  const tokenIds = [...tokenIdsHex].map(id => decodeHex(id))
  const tokenManagerData = await getTokenManagerData(ctx, block.header, tokenIds, accountIds)
  ctx.log
    .child('tokens')
    .debug(`tokenManagerData ${tokenManagerData}, accountIds ${[...accountIdsHex]} tokenIds ${[...tokenIdsHex]}`)
  await saveTokenBalanceForAccount(ctx, block.header, tokenIds, accountIds, tokenManagerData!)
  await setChainState(ctx, block.header)
}

async function saveTokenBalanceForAccount(
  ctx: Context,
  block: SubstrateBlock,
  tokenIds: Uint8Array[],
  accountIds: Uint8Array[],
  balance: bigint[]
) {
  if (tokenIds.length && accountIds.length) {
    const balancesToBeSaved = accountIds.map((aid, index) => {
      return new TokenBalanceForAccount({
        id: randomUUID(),
        tokenId: toHex(tokenIds[0]),
        accountId: encodeId(aid),
        amount: balance[index] ?? 0,
        updatedAt: block.height
      })
    })
    ctx.store.save(balancesToBeSaved)
    ctx.log.child('tokens').info(`updated balances: ${balancesToBeSaved.length}`)  }
}

async function getTokenManagerData(
  ctx: ChainContext,
  block: Block,
  tokenIds: Uint8Array[],
  accountIds: Uint8Array[]
) {
  const storage = new TokenManagerBalancesStorage(ctx, block)
  if (!storage.isExists || !storage.isV10) {
    return
  }

  let v10InputArray: [Uint8Array, Uint8Array][] = []

  if (tokenIds.length === 1) {
    v10InputArray = accountIds.map(id => [tokenIds[0], id])
  } else if (accountIds.length === 1) {
    v10InputArray = tokenIds.map(id => [id, accountIds[0]])
  } else {
    for (const tokenId of tokenIds) {
      for (const accountId of accountIds) {
        v10InputArray.push([tokenId, accountId])
      }
    }
  }

  return await storage.getManyAsV10(v10InputArray)
}

function processTokensCallItem(
  ctx: Context,
  item: CallItem,
  accountIds: Set<string>,
  tokenIds: Set<string>
) {
  const call = item.call as SubstrateCall
  if (call.parent != null) return

  const id = getOriginAccountId(call.origin)
  if (id == null) return

  accountIds.add(id)
}

function processTokensEventItem(
  ctx: Context,
  item: EventItem,
  accountIds: Set<string>,
  tokenIds: Set<string>
) {
  switch (item.name) {
    case 'TokenManager.TokenTransferred': {
      const { tokenId, accounts } = getTokenTransferredData(ctx, item.event)
      accounts?.forEach(acc => accountIds.add(acc))
      tokenIds.add(tokenId)
      break
    }
    case 'TokenManager.TokenLowered': {
      const { tokenId, accounts } = getTokenLowerData(ctx, item.event)
      accounts?.forEach(acc => accountIds.add(acc))
      tokenIds.add(tokenId)
      break
    }
    case 'TokenManager.TokenLifted': {
      const { tokenId, accounts } = getTokenLiftedData(ctx, item.event)
      accounts?.forEach(acc => accountIds.add(acc))
      tokenIds.add(tokenId)
      break
    }
  }
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getOriginAccountId(origin: any) {
  if (origin && origin.__kind === 'system' && origin.value.__kind === 'Signed') {
    return origin.value.value
  } else {
    return undefined
  }
}

export function encodeId(id: Uint8Array) {
  return ss58.codec(config.prefix).encode(id)
}
