import {
  BatchContext,
  BatchProcessorCallItem,
  BatchProcessorEventItem,
  BatchProcessorItem,
  SubstrateBlock,
  SubstrateCall,
  decodeHex,
  toHex
} from '@subsquid/substrate-processor'
import { randomUUID } from 'crypto'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import { getProcessor } from '@avn/config'
import { encodeId } from '@avn/utils'
import {
  getTokenLiftedData,
  getTokenLowerData,
  getTokenTransferredData,
  RawTokenBalanceData
} from './eventHandlers'
import { getLastChainState, setChainState } from './service/chainState.service'
import { Block, ChainContext } from './types/generated/parachain-dev/support'
import { TokenManagerBalancesStorage } from './types/generated/parachain-dev/storage'
import { TokenBalanceForAccount } from './model'
import retry from 'async-retry'

const processor = getProcessor()
  .addEvent('TokenManager.TokenLifted', {
    data: { event: { args: true } }
  } as const)
  .addEvent('TokenManager.TokenTransferred', {
    data: { event: { args: true } }
  } as const)
  .addEvent('TokenManager.TokenLowered', {
    data: { event: { args: true } }
  } as const)
  .addCall('Migration.migrate_token_manager_balances', {
    data: { call: { origin: true, args: true }, extrinsic: { call: { args: true } } }
  } as const)

type Item = BatchProcessorItem<typeof processor>
type EventItem = BatchProcessorEventItem<typeof processor>
type CallItem = BatchProcessorCallItem<typeof processor>
type Context = BatchContext<Store, Item>
const db = new TypeormDatabase()
processor.run(db, processTokens)

const SAVE_PERIOD = 12 * 60 * 60 * 1000
let lastStateTimestamp: number | undefined

export interface TokenTransferData {
  amount: bigint
  tokenId: string
  accountId: string
}

async function processTokens(ctx: Context): Promise<void> {
  const accountIdsHex = new Set<string>()
  const tokenIdsHex = new Set<string>()
  const tokenTransferData: TokenBalanceForAccount[] = []

  for (const block of ctx.blocks) {
    for (const item of block.items) {
      if (item.kind === 'call') {
        await processTokensCallItem(
          ctx,
          item,
          accountIdsHex,
          tokenIdsHex,
          block.header,
          tokenTransferData
        )
      } else if (item.kind === 'event') {
        await processTokensEventItem(ctx, item, tokenTransferData, block.header)
      }
    }

    if (lastStateTimestamp == null) {
      lastStateTimestamp = (await getLastChainState(ctx.store))?.timestamp.getTime() ?? 0
    }
  }

  const block = ctx.blocks[ctx.blocks.length - 1]
  ctx.log.child('tokens').debug(`tokenManagerData ${tokenTransferData}`)
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  await saveTokenBalanceForAccount(ctx, tokenTransferData)
  await setChainState(ctx, block.header)
}

async function saveTokenBalanceForAccount(
  ctx: Context,
  tokenTransferData: TokenBalanceForAccount[]
): Promise<void> {
  await ctx.store.save(tokenTransferData)
  ctx.log.child('tokens').info(`updated balances: ${tokenTransferData.length}`)
}

async function getTokenManagerData(
  ctx: ChainContext,
  block: Block,
  tokenId: Uint8Array,
  accountId: Uint8Array
): Promise<bigint> {
  const storage = new TokenManagerBalancesStorage(ctx, block)

  return await storage.asV21.get([tokenId, accountId])
}

export function extractPublicKey(tuple: string): string {
  return `0x${tuple.slice(-64)}`
}

function extractTokenId(input: string): string {
  return '0x' + input.slice(98, 138)
}

async function processMigrationCall(
  ctx: Context,
  item: CallItem,
  block: SubstrateBlock
): Promise<void> {
  if (item.name !== 'Migration.migrate_token_manager_balances') return
  const chunkSize = 1000
  let chunk: TokenBalanceForAccount[] = []
  const batch = item.call.args.tokenAccountPairs

  for (const migratedData of batch) {
    const tokenId = extractTokenId(migratedData[0])
    const accountId = encodeId(decodeHex(extractPublicKey(migratedData[0])))
    const balance = await getTokenManagerData(
      ctx,
      block,
      decodeHex(extractTokenId(migratedData[0])),
      decodeHex(extractPublicKey(migratedData[0]))
    )
    chunk.push(
      new TokenBalanceForAccount({
        tokenId,
        accountId,
        amount: migratedData[1],
        updatedAt: block.height,
        timestamp: new Date(block.timestamp),
        reason: `${item.name} ${block.height}`,
        balance
      })
    )
    if (chunk.length === chunkSize) {
      await processChunk(ctx, chunk)
      chunk = []
    }
  }
  if (chunk.length > 0) {
    await processChunk(ctx, chunk)
    chunk = []
  }
}

async function processChunk(ctx: Context, chunk: TokenBalanceForAccount[]): Promise<void> {
  ctx.log.child('tokens').info(`Processing chunk of size ${chunk.length}`)
  try {
    ctx.log.child('tokens').debug('Starting transaction')
    await ctx.store.save<TokenBalanceForAccount>(chunk)
    ctx.log.child('tokens').info('Transaction successful')
  } catch (err: any) {
    ctx.log.child('tokens').warn(`Transaction failed: ${err.message}`)
    if (err.message === 'Transaction was already closed') {
      ctx.log.child('tokens').error('Transaction closed, retrying...')
      throw err
    } else {
      throw err
    }
  }
}

async function processTokensCallItem(
  ctx: Context,
  item: CallItem,
  accountIds: Set<string>,
  tokenIds: Set<string>,
  block: SubstrateBlock,
  tokenTransferData: TokenTransferData[]
): Promise<void> {
  switch (item.name) {
    case 'Migration.migrate_token_manager_balances': {
      await processMigrationCall(ctx, item, block)
      break
    }
    default: {
      const call = item.call as SubstrateCall
      if (call.parent != null) return

      const id = getOriginAccountId(call.origin)
      if (id == null) return

      accountIds.add(id)
    }
  }
}

async function processTokensEventItem(
  ctx: Context,
  item: EventItem,
  tokenTransferData: TokenTransferData[],
  block: SubstrateBlock
): Promise<void> {
  // eslint-disable-next-line
  let tokenTransferResponse = {} as RawTokenBalanceData
  if (item.name === 'TokenManager.TokenTransferred') {
    tokenTransferResponse = getTokenTransferredData(ctx, item.event)
  } else if (item.name === 'TokenManager.TokenLowered') {
    tokenTransferResponse = getTokenLowerData(ctx, item.event)
  } else if (item.name === 'TokenManager.TokenLifted') {
    tokenTransferResponse = getTokenLiftedData(ctx, item.event)
  }

  const balance = await getTokenManagerData(
    ctx,
    block,
    tokenTransferResponse.tokenId,
    tokenTransferResponse.accountId
  )
  const normalizedTokenData = new TokenBalanceForAccount({
    tokenId: toHex(tokenTransferResponse.tokenId),
    accountId: toHex(tokenTransferResponse.accountId),
    reason: `${item.name} ${block.height}`,
    id: item.event.id,
    updatedAt: block.height,
    timestamp: new Date(block.timestamp),
    amount: tokenTransferResponse.amount,
    balance
  })
  tokenTransferData.push(normalizedTokenData)
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getOriginAccountId(origin: any): any {
  if (origin && origin.__kind === 'system' && origin.value.__kind === 'Signed') {
    return origin.value.value
  } else {
    return undefined
  }
}
