import {
  BatchContext,
  BatchProcessorItem,
  SubstrateBlock,
  toHex
} from '@subsquid/substrate-processor'
import { encodeId } from '@avn/utils'
import { EventItem } from '@subsquid/substrate-processor/lib/interfaces/dataSelection'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import { Transfer, TokenLookup } from './model'
import {
  BalancesTransferEvent,
  TokenManagerTokenTransferredEvent
} from './types/generated/parachain-dev/events'
import { getProcessor } from '@avn/config'
import { In } from 'typeorm'

interface TransferEventData {
  id: string
  blockNumber: number
  timestamp: Date
  extrinsicHash?: string
  from: string
  to: string
  amount: bigint
  tokenName: string | undefined
  tokenId: string | undefined
  pallet: string
  method: string
}

const processor = getProcessor()
  .addEvent('Balances.Transfer', {
    data: {
      event: {
        args: true,
        extrinsic: {
          hash: true
        },
        call: {}
      }
    }
  } as const)
  .addEvent('TokenManager.TokenTransferred', {
    data: {
      event: {
        args: true,
        extrinsic: {
          hash: true
        },
        call: {}
      }
    }
  } as const)

type Item = BatchProcessorItem<typeof processor>
type Ctx = BatchContext<Store, Item>

type TransfersEventItem =
  | EventItem<'Balances.Transfer', { event: { args: true; extrinsic: { hash: true }; call: {} } }>
  | EventItem<
      'TokenManager.TokenTransferred',
      { event: { args: true; extrinsic: { hash: true }; call: {} } }
    >

async function createTokenLookupMap(ctx: Ctx): Promise<Map<any, any>> {
  const tokenLookupData = await ctx.store.find(TokenLookup, { where: {} })
  const tokenLookupMap = new Map<string, string>()

  tokenLookupData.forEach((token: any) => {
    tokenLookupMap.set(token.tokenId, token.tokenName)
  })
  return tokenLookupMap
}

let tokenLookupMap: Map<string, string> | null = null

async function processEvents(ctx: Ctx) {
  const transfersData: TransferEventData[] = []

  if (!tokenLookupMap) {
    tokenLookupMap = await createTokenLookupMap(ctx)
  }

  const avtHash = getKeyByValue(tokenLookupMap, 'AVT')

  for (const block of ctx.blocks) {
    for (const item of block.items) {
      if (item.name === 'Balances.Transfer' || item.name === 'TokenManager.TokenTransferred') {
        transfersData.push(
          handleTransfer(ctx, block.header, item as TransfersEventItem, tokenLookupMap, avtHash)
        )
      }
    }
  }

  await saveTransfers(ctx, transfersData)
}

function handleTransfer(
  ctx: Ctx,
  block: SubstrateBlock,
  item: TransfersEventItem,
  tokensMap: Map<string, string>,
  avtHash: string
): TransferEventData {
  const event =
    item.name === 'Balances.Transfer'
      ? normalizeBalancesTransferEvent(ctx, item, avtHash)
      : normalizeTokenTransferEvent(ctx, item)
  const palletInfoArray = item.name.split('.')

  const tokenId = event.tokenId ? handleTokenId(event.tokenId) : ''
  const tokenName = tokensMap.has(tokenId) ? tokensMap.get(tokenId) : ''

  return {
    id: item.event.id,
    blockNumber: block.height,
    timestamp: new Date(block.timestamp),
    extrinsicHash: item.event.extrinsic?.hash,
    from: encodeId(event.from),
    to: encodeId(event.to),
    amount: event.amount,
    tokenName,
    tokenId,
    pallet: palletInfoArray[0],
    method: palletInfoArray[1]
  }
}

function handleTokenId(tokenId: string | Uint8Array) {
  if (typeof tokenId === 'string') {
    return tokenId
  } else {
    return toHex(tokenId)
  }
}

async function saveTransfers(ctx: Ctx, transfersData: TransferEventData[]): Promise<void> {
  const accountIds = new Set<string>()
  for (const t of transfersData) {
    accountIds.add(t.from)
    accountIds.add(t.to)
  }

  const accounts = await ctx.store
    .findBy(Transfer, { from: In([...accountIds]) })
    .then((q: any) => q.map((i: any) => i.fromId))

  const transfers: Transfer[] = []

  for (const t of transfersData) {
    const { id, blockNumber, timestamp, extrinsicHash, amount, tokenId, method, pallet } = t

    const from = getAccount(accounts, t.from)
    const to = getAccount(accounts, t.to)

    transfers.push(
      new Transfer({
        id,
        blockNumber,
        timestamp,
        extrinsicHash,
        from,
        to,
        amount,
        tokenId,
        method,
        pallet
      })
    )
  }

  // await ctx.store.save(Array.from(accounts))
  await ctx.store.insert(transfers)
}

function getKeyByValue(map: Map<any, any>, searchValue: any): any | undefined {
  for (const [key, value] of map.entries()) {
    // console.log(key, value)
    if (value === searchValue) {
      return key
    }
  }
  return undefined
}

function normalizeBalancesTransferEvent(
  ctx: Ctx,
  item: EventItem<'Balances.Transfer', { event: { args: true } }>,
  avtHash: string
): { from: Uint8Array; to: Uint8Array; amount: bigint; tokenId: string } {
  const e = new BalancesTransferEvent(ctx, item.event)
  if (e.isV21) {
    const { from, to, amount } = e.asV21
    return { from, to, amount, tokenId: avtHash }
  } else {
    throw new UknownVersionError()
  }
}

function normalizeTokenTransferEvent(
  ctx: Ctx,
  item: EventItem<'TokenManager.TokenTransferred', { event: { args: true } }>
): { from: Uint8Array; to: Uint8Array; amount: bigint; tokenId: Uint8Array } {
  const e = new TokenManagerTokenTransferredEvent(ctx, item.event)
  if (e.isV21) {
    const { sender, recipient, tokenBalance, tokenId } = e.asV21
    return { from: sender, to: recipient, amount: tokenBalance, tokenId }
  } else {
    throw new UknownVersionError()
  }
}

function getAccount(m: string[], id: string): string {
  const acc = m.includes(id)
  if (acc === null || acc === undefined) {
    m.push(id, id)
  }
  return id
}

class UknownVersionError extends Error {
  constructor() {
    super('Uknown verson')
  }
}

processor.run(new TypeormDatabase(), processEvents)
