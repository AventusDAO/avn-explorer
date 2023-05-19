import {
  BatchContext,
  BatchProcessorItem,
  SubstrateBlock,
  toHex
} from '@subsquid/substrate-processor'
import { encodeId } from '@avn/utils'
import { EventItem } from '@subsquid/substrate-processor/lib/interfaces/dataSelection'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import { Transfer, TransferType } from './model'
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
  tokenId: string | undefined
  transferType: TransferType
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

processor.run(new TypeormDatabase(), processEvents)

async function processEvents(ctx: Ctx): Promise<void> {
  const transfersData: TransferEventData[] = []

  for (const block of ctx.blocks) {
    for (const item of block.items) {
      if (item.name === 'Balances.Transfer' || item.name === 'TokenManager.TokenTransferred') {
        transfersData.push(handleTransfer(ctx, block.header, item))
      }
    }
  }

  await saveTransfers(ctx, transfersData)
}

function handleTransfer(
  ctx: Ctx,
  block: SubstrateBlock,
  item: TransfersEventItem
): TransferEventData {
  const event =
    item.name === 'Balances.Transfer'
      ? normalizeBalancesTransferEvent(ctx, item)
      : normalizeTokenTransferEvent(ctx, item)
  return {
    id: item.event.id,
    blockNumber: block.height,
    timestamp: new Date(block.timestamp),
    extrinsicHash: item.event.extrinsic?.hash,
    from: encodeId(event.from),
    to: encodeId(event.to),
    amount: event.amount,
    tokenId: event.tokenId ? toHex(event.tokenId) : undefined,
    transferType:
      item.name === 'Balances.Transfer'
        ? TransferType.BALANCES_TRANSFER
        : TransferType.TOKEN_PROXY_TRANSFER
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
    const { id, blockNumber, timestamp, extrinsicHash, amount, tokenId, transferType } = t

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
        transferType
      })
    )
  }

  // await ctx.store.save(Array.from(accounts))
  await ctx.store.insert(transfers)
}

function normalizeBalancesTransferEvent(
  ctx: Ctx,
  item: EventItem<'Balances.Transfer', { event: { args: true } }>
): { from: Uint8Array; to: Uint8Array; amount: bigint; tokenId: undefined } {
  const e = new BalancesTransferEvent(ctx, item.event)
  if (e.isV21) {
    const { from, to, amount } = e.asV21
    return { from, to, amount, tokenId: undefined }
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
