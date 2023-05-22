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
import { getTokenLiftedData, getTokenLowerData, getTokenTransferredData } from './eventHandlers'
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
    data: { call: { origin: true }, extrinsic: { call: { args: true } } }
  } as const)
  .addCall('*', {
    data: { call: { origin: true } }
  } as const)
  .includeAllBlocks()

type Item = BatchProcessorItem<typeof processor>
type EventItem = BatchProcessorEventItem<typeof processor>
type CallItem = BatchProcessorCallItem<typeof processor>
type Context = BatchContext<Store, Item>
const db = new TypeormDatabase()
processor.run(db, processTokens)

const SAVE_PERIOD = 12 * 60 * 60 * 1000
let lastStateTimestamp: number | undefined

async function processTokens(ctx: Context): Promise<void> {
  const accountIdsHex = new Set<string>()
  const tokenIdsHex = new Set<string>()

  for (const block of ctx.blocks) {
    for (const item of block.items) {
      if (item.kind === 'call') {
        await processTokensCallItem(ctx, item, accountIdsHex, tokenIdsHex, block.header)
      } else if (item.kind === 'event') {
        processTokensEventItem(ctx, item, accountIdsHex, tokenIdsHex)
      }
    }

    if (lastStateTimestamp == null) {
      lastStateTimestamp = (await getLastChainState(ctx.store))?.timestamp.getTime() ?? 0
    }

    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
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
    .debug(
      `tokenManagerData ${tokenManagerData}, accountIds ${[...accountIdsHex]} tokenIds ${[
        ...tokenIdsHex
      ]}`
    )
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  await saveTokenBalanceForAccount(ctx, block.header, tokenIds, accountIds, tokenManagerData!)
  await setChainState(ctx, block.header)
}

async function saveTokenBalanceForAccount(
  ctx: Context,
  block: SubstrateBlock,
  tokenIds: Uint8Array[],
  accountIds: Uint8Array[],
  balance: bigint[]
): Promise<void> {
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
    await ctx.store.save(balancesToBeSaved)
    ctx.log.child('tokens').info(`updated balances: ${balancesToBeSaved.length}`)
  }
}

async function getTokenManagerData(
  ctx: ChainContext,
  block: Block,
  tokenIds: Uint8Array[],
  accountIds: Uint8Array[]
): Promise<bigint[] | undefined> {
  const storage = new TokenManagerBalancesStorage(ctx, block)
  if (!storage.isExists || !storage.isV21) {
    return
  }

  let v10InputArray: Array<[Uint8Array, Uint8Array]> = []

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

  return await storage.getManyAsV21(v10InputArray)
}

export function extractPublicKey(tuple: string): string {
  return `0x${tuple.slice(-64)}`
}

function extractTokenId(input: string): string {
  return '0x' + input.slice(98, 138)
}

async function processData(ctx: Context, item: CallItem, block: SubstrateBlock): Promise<void> {
  if (item.name !== 'Migration.migrate_token_manager_balances') return
  const chunkSize = 1000
  let chunk: TokenBalanceForAccount[] = []
  const migratedTokenBalancesBatches = item.extrinsic.call.args.calls.map(
    (c: any) => c.value.call.value.tokenAccountPairs
  )

  for (const batch of migratedTokenBalancesBatches) {
    for (const migratedData of batch) {
      chunk.push(
        new TokenBalanceForAccount({
          id: randomUUID(),
          tokenId: extractTokenId(migratedData[0]),
          accountId: encodeId(decodeHex(extractPublicKey(migratedData[0]))),
          amount: migratedData[1],
          updatedAt: block.height
        })
      )
      if (chunk.length === chunkSize) {
        await processChunk(ctx, chunk)
        chunk = []
      }
    }
  }
  if (chunk.length > 0) {
    await processChunk(ctx, chunk)
    chunk = []
  }
}

async function processChunk(ctx: Context, chunk: TokenBalanceForAccount[]): Promise<void> {
  ctx.log.child('tokens').info(`Processing chunk of size ${chunk.length}`)
  await retry(
    async (bail: any) => {
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
          bail(err)
        }
      }
    },
    { retries: 3, minTimeout: 1000 }
  )
}

async function processTokensCallItem(
  ctx: Context,
  item: CallItem,
  accountIds: Set<string>,
  tokenIds: Set<string>,
  block: SubstrateBlock
): Promise<void> {
  switch (item.name) {
    case 'Migration.migrate_token_manager_balances': {
      await processData(ctx, item, block)

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

function processTokensEventItem(
  ctx: Context,
  item: EventItem,
  accountIds: Set<string>,
  tokenIds: Set<string>
): void {
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
export function getOriginAccountId(origin: any): any {
  if (origin && origin.__kind === 'system' && origin.value.__kind === 'Signed') {
    return origin.value.value
  } else {
    return undefined
  }
}
