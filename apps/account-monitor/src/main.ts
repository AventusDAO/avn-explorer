import {
  BatchContext,
  BatchProcessorItem,
  SubstrateBlock,
  toHex
} from '@subsquid/substrate-processor'
import { encodeId } from '@avn/utils'
import { EventItem } from '@subsquid/substrate-processor/lib/interfaces/dataSelection'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import { TokenTransfer, TokenLookup, Account, Token } from './model'
import {
  BalancesTransferEvent,
  TokenManagerTokenLiftedEvent,
  TokenManagerTokenLoweredEvent,
  TokenManagerTokenTransferredEvent
} from './types/generated/parachain-testnet/events'
import processor from './processor'

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

type Item = BatchProcessorItem<typeof processor>
type Ctx = BatchContext<Store, Item>

type TransfersEventItem =
  | EventItem<'Balances.Transfer', { event: { args: true; extrinsic: { hash: true }; call: {} } }>
  | EventItem<
      'TokenManager.TokenTransferred',
      { event: { args: true; extrinsic: { hash: true }; call: {} } }
    >
  | EventItem<
      'TokenManager.TokenLowered',
      { event: { args: true; extrinsic: { hash: true }; call: {} } }
    >
  | EventItem<
      'TokenManager.TokenLifted',
      { event: { args: true; extrinsic: { hash: true }; call: {} } }
    >

async function createTokenLookupMap(ctx: Ctx): Promise<Map<any, any>> {
  const tokenLookupData = await getTokenLookupData(ctx)
  const tokenLookupMap = new Map<string, string>()

  tokenLookupData.forEach((token: any) => {
    tokenLookupMap.set(token.tokenId, token.tokenName)
  })
  return tokenLookupMap
}

async function getTokenLookupData(ctx: Ctx) {
  return ctx.store.find(TokenLookup, { where: {} })
}

let tokenLookupMap: Map<string, string> | null = null

async function processEvents(ctx: Ctx) {
  if (!tokenLookupMap) {
    tokenLookupMap = await createTokenLookupMap(ctx)
  }

  const avtHash = getKeyByValue(tokenLookupMap, 'AVT')
  const transfersData: TransferEventData[] = await getTransfers(ctx, tokenLookupMap, avtHash)

  const accounts: Map<string, Account> = createAccounts(transfersData)
  const tokens: Map<string, Token> = createTokens(transfersData, accounts)
  const transfers: TokenTransfer[] = createTransfers(transfersData, accounts, tokens)

  await upsertEntities(ctx, accounts)
  await upsertEntities(ctx, tokens)
  await ctx.store.insert(transfers)
}

async function upsertEntities<T extends { id: string }>(
  ctx: Ctx,
  entities: Map<string, T>
): Promise<void> {
  for (const [id, entity] of entities.entries()) {
    let storedEntity = await ctx.store.get(entity.constructor as any, { where: { id } })

    if (!storedEntity) {
      await ctx.store.save(entity)
    } else {
      storedEntity = Object.assign(storedEntity, entity)
      await ctx.store.save(storedEntity)
    }
  }
}

function createAccounts(transfers: TransferEventData[]): Map<string, Account> {
  const accounts: Map<string, Account> = new Map()
  for (let t of transfers) {
    accounts.set(t.from, new Account({ id: t.from }))
    accounts.set(t.to, new Account({ id: t.to }))
  }
  return accounts
}

function createTokens(
  transfers: TransferEventData[],
  accounts: Map<string, Account>
): Map<string, Token> {
  const tokenMap = new Map<string, Token>()

  for (const transfer of transfers) {
    if (transfer.tokenId && !tokenMap.has(transfer.tokenId)) {
      let tokenAccount = accounts.get(transfer.to)
      tokenMap.set(
        transfer.tokenId,
        new Token({ id: transfer.tokenId, name: transfer.tokenName, account: tokenAccount })
      )
    }
  }

  return tokenMap
}

function createTransfers(
  transfers: TransferEventData[],
  accounts: Map<string, Account>,
  tokens: Map<string, Token>
): TokenTransfer[] {
  return transfers.map(transfer => {
    return new TokenTransfer({
      id: transfer.id,
      blockNumber: transfer.blockNumber,
      timestamp: transfer.timestamp,
      extrinsicHash: transfer.extrinsicHash,
      from: accounts.get(transfer.from),
      to: accounts.get(transfer.to),
      amount: transfer.amount,
      token: tokens.get(transfer.tokenId ?? ''),
      pallet: transfer.pallet,
      method: transfer.method
    })
  })
}
async function getTransfers(ctx: Ctx, tokenLookupMap: Map<string, string>, avtHash: string) {
  const transfersData: TransferEventData[] = []
  for (const block of ctx.blocks) {
    for (const item of block.items) {
      transfersData.push(
        handleTransfer(ctx, block.header, item as TransfersEventItem, tokenLookupMap, avtHash)
      )
    }
  }
  return transfersData
}

function getEvent(ctx: Ctx, item: TransfersEventItem, avtHash: string) {
  switch (item.name) {
    case 'Balances.Transfer':
      return normalizeBalancesTransferEvent(ctx, item, avtHash)
    case 'TokenManager.TokenTransferred':
      return normalizeTokenTransferEvent(ctx, item)
    case 'TokenManager.TokenLifted':
      return normalizeTokenLiftedEvent(ctx, item)
    case 'TokenManager.TokenLowered':
      return normalizeTokenLoweredEvent(ctx, item)
  }
}

function handleTransfer(
  ctx: Ctx,
  block: SubstrateBlock,
  item: TransfersEventItem,
  tokensMap: Map<string, string>,
  avtHash: string
): TransferEventData {
  const event = getEvent(ctx, item, avtHash)
  if (!event) throw new Error()
  const palletInfoArray = item.name.split('.')
  const tokenId = event.tokenId ? handleTokenId(event.tokenId) : ''
  const tokenName = tokensMap.has(tokenId) ? tokensMap.get(tokenId) : ''

  const accountIdFrom = event.from ? encodeId(event.from) : ''
  const accountIdTo = encodeId(event.to)

  return {
    id: item.event.id,
    blockNumber: block.height,
    timestamp: new Date(block.timestamp),
    extrinsicHash: item.event.extrinsic?.hash,
    from: accountIdFrom,
    to: accountIdTo,
    amount: event.amount,
    tokenName,
    tokenId: tokenId ?? avtHash,
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

function getKeyByValue(map: Map<any, any>, searchValue: any): any | undefined {
  for (const [key, value] of map.entries()) {
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
  if (e.isV4) {
    const { from, to, amount } = e.asV4
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
  if (e.isV4) {
    const { sender, recipient, tokenBalance, tokenId } = e.asV4
    return { from: sender, to: recipient, amount: tokenBalance, tokenId }
  } else {
    throw new UknownVersionError()
  }
}

function normalizeTokenLiftedEvent(
  ctx: Ctx,
  item: EventItem<'TokenManager.TokenLifted', { event: { args: true } }>
) {
  const e = new TokenManagerTokenLiftedEvent(ctx, item.event)
  if (e.isV4) {
    const { tokenId, recipient, tokenBalance, ethTxHash } = e.asV4
    return { from: undefined, to: recipient, amount: tokenBalance, tokenId }
  } else {
    throw new UknownVersionError()
  }
}
function normalizeTokenLoweredEvent(
  ctx: Ctx,
  item: EventItem<'TokenManager.TokenLowered', { event: { args: true } }>
) {
  const e = new TokenManagerTokenLoweredEvent(ctx, item.event)
  if (e.isV4) {
    const { tokenId, recipient, sender, amount, t1Recipient } = e.asV4
    return { from: sender, to: recipient, amount, tokenId }
  } else {
    throw new UknownVersionError()
  }
}

class UknownVersionError extends Error {
  constructor() {
    super('Uknown verson')
  }
}

processor.run(new TypeormDatabase(), processEvents)
