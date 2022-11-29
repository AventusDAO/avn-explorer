import {
  BatchContext,
  BatchProcessorCallItem,
  BatchProcessorEventItem,
  BatchProcessorItem,
  SubstrateBlock,
  SubstrateCall
} from '@subsquid/substrate-processor'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import config from './config'
import { getProcessor } from '@avn/config'
import { getTokenLiftedData, getTokenLowerData, getTokenTransferredData } from './eventHandlers'

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
  const tokenIds = new Set<Uint8Array>()

  for (const block of ctx.blocks) {
    for (const item of block.items) {
      if (item.kind === 'call') {
        processTokensCallItem(ctx, item, accountIdsHex, tokenIds)
      } else if (item.kind === 'event') {
        processTokensEventItem(ctx, item, accountIdsHex, tokenIds, block.header)
      }
    }

    // why account ids are encoded into hex and then decoded?
    // do I need chainstate for recording accounts and tokens (I suspect I dont)

    if (lastStateTimestamp == null) {
      lastStateTimestamp =
        (await getLastChainState(ctx.store))?.timestamp.getTime() ?? 0
    }
    if (block.header.timestamp - lastStateTimestamp >= SAVE_PERIOD) {
      const accountIdsU8 = [...accountIdsHex].map(id => decodeHex(id))
      balances = await getBalances(ctx, block.header, accountIdsU8)
      if (!balances) {
        ctx.log.warn('No balances')
      }
  }
}

function processTokensCallItem(
  ctx: Context,
  item: CallItem,
  accountIdsHex: Set<string>,
  tokenIds: Set<Uint8Array>
) {
  const call = item.call as SubstrateCall
  if (call.parent != null) return

  const id = getOriginAccountId(call.origin)
  if (id == null) return

  accountIdsHex.add(id)
}

function processTokensEventItem(
  ctx: Context,
  item: EventItem,
  accountIdsHex: Set<string>,
  tokenIds: Set<Uint8Array>,
  block: SubstrateBlock
) {
  switch (item.name) {
    case 'TokenManager.TokenTransferred': {
      const { tokenId, accounts } = getTokenTransferredData(ctx, item.event)
      accounts?.forEach(acc => accountIdsHex.add(acc))
      tokenIds.add(tokenId)
      break
    }
    case 'TokenManager.TokenLowered': {
      const { tokenId, accounts } = getTokenLowerData(ctx, item.event)
      accounts?.forEach(acc => accountIdsHex.add(acc))
      tokenIds.add(tokenId)
      break
    }
    case 'TokenManager.TokenLifted': {
      const { tokenId, accounts } = getTokenLiftedData(ctx, item.event)
      accounts?.forEach(acc => accountIdsHex.add(acc))
      tokenIds.add(tokenId)
      break
    }
  }
}

export class UnknownVersionError extends Error {
  constructor(name: string) {
    super(`There is no relevant version for ${name}`)
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
