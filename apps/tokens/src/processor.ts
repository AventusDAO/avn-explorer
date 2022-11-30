import {
  BatchContext,
  BatchProcessorCallItem,
  BatchProcessorEventItem,
  BatchProcessorItem,
  SubstrateBlock,
  SubstrateCall
} from '@subsquid/substrate-processor'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import * as ss58 from '@subsquid/ss58'
import config from './config'
import { getProcessor } from '@avn/config'
import { getTokenLiftedData, getTokenLowerData, getTokenTransferredData } from './eventHandlers'
import { getLastChainState, setChainState } from './service/chainState.service'
import { Account, Token } from './model'
import { Block, ChainContext } from './types/generated/parachain-dev/support'

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
  const accountIds = new Set<Uint8Array>()
  const tokenIds = new Set<Uint8Array>()

  for (const block of ctx.blocks) {
    for (const item of block.items) {
      if (item.kind === 'call') {
        processTokensCallItem(ctx, item, accountIds, tokenIds)
      } else if (item.kind === 'event') {
        processTokensEventItem(ctx, item, accountIds, tokenIds, block.header)
      }
    }

    if (lastStateTimestamp == null) {
      lastStateTimestamp = (await getLastChainState(ctx.store))?.timestamp.getTime() ?? 0
    }

    if (block.header.timestamp - lastStateTimestamp! >= SAVE_PERIOD) {
      await getTokenManagerData(ctx, block.header, [...tokenIds])
      await saveAccounts(ctx, block.header, accountIds)
    }

    // why account ids are encoded into hex and then decoded?
    // do I need chainstate for recording accounts and tokens (I suspect I dont)
  }

  const block = ctx.blocks[ctx.blocks.length - 1]
  const tokens = [...tokenIds]
  await getTokenManagerData(ctx, block.header, tokens)
  await saveAccounts(ctx, block.header, accountIds)
  await saveTokens(ctx, block.header, tokenIds)
  await setChainState(ctx, block.header)
}

async function saveAccounts(
  ctx: Context,
  block: SubstrateBlock,
  accountIds: Set<Uint8Array>
): Promise<void> {
  const accounts = [...accountIds].map(
    (id: Uint8Array) => new Account({ id: encodeId(id), updatedAt: block.height })
  )
  await ctx.store.save(accounts)
}

async function saveTokens(ctx: Context, block: SubstrateBlock, tokenIds: Set<Uint8Array>) {
  const tokens = [...tokenIds].map((id: Uint8Array) => new Token({ id: encodeId(id) }))
  await ctx.store.save(tokens)
}

async function getTokenManagerData(ctx: ChainContext, block: Block, tokens: Uint8Array[]) {
  console.log('HELP 2 !!!', tokens)
  const data = await ctx._chain.queryStorage(
    block.hash,
    'TokenManager',
    'Balances',
    0xea055d6f2e2280ecfd691e28f3062047c3904273ea699ec5d05c43a5b8413e55
  )
  console.log('HELP !!!', data)
}

function processTokensCallItem(
  ctx: Context,
  item: CallItem,
  accountIds: Set<Uint8Array>,
  tokenIds: Set<Uint8Array>
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
  accountIds: Set<Uint8Array>,
  tokenIds: Set<Uint8Array>,
  block: SubstrateBlock
) {
  console.log('ITEM !!!', item)
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

export function encodeId(id: Uint8Array) {
  return ss58.codec(config.prefix).encode(id)
}
