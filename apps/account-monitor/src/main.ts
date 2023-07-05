import {
  BatchContext,
  BatchProcessorItem,
  SubstrateBlock,
  toHex,
  decodeHex
} from '@subsquid/substrate-processor'
import { encodeId } from '@avn/utils'
import { EventItem } from '@subsquid/substrate-processor/lib/interfaces/dataSelection'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import { TokenTransfer, TokenLookup, Account, Token, AccountToken } from './model'
import {
  BalancesTransferEvent,
  TokenManagerTokenLiftedEvent,
  TokenManagerTokenLoweredEvent,
  TokenManagerTokenTransferredEvent
} from './types/generated/parachain-testnet/events'
import { TokenManagerBalancesStorage } from './types/generated/parachain-testnet/storage'
import processor from './processor'
import { Block } from './types/generated/parachain-testnet/support'

interface TransferEventData {
  id: string
  blockNumber: number
  timestamp: Date
  extrinsicHash?: string
  from: string | undefined
  to: string
  amount: bigint
  tokenName: string | undefined
  tokenId: string
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
  return await ctx.store.find(TokenLookup, { where: {} })
}

let tokenLookupMap: Map<string, string> | null = null

async function processEvents(ctx: Ctx) {
  if (!tokenLookupMap) {
    tokenLookupMap = await createTokenLookupMap(ctx)
  }

  const avtHash = getKeyByValue(tokenLookupMap, 'AVT')
  const { accounts, tokens, accountTokens, transfers } = await getTransfers(
    ctx,
    tokenLookupMap,
    avtHash
  )

  await ctx.store.save([...tokens.values()])
  await ctx.store.save([...accounts.values()])
  await ctx.store.save([...accountTokens.values()])
  await ctx.store.insert(transfers)
}

function mapAccountEntities(data: TransferEventData[], accounts: Map<string, Account>) {
  for (const item of data) {
    if (item.from && item.to) {
      accounts.set(
        item.from,
        new Account({
          id: item.from
        })
      )
      accounts.set(
        item.to,
        new Account({
          id: item.to
        })
      )
    }
  }
}

function mapTokenEntities(data: TransferEventData[], tokens: Map<string, Token>) {
  for (const item of data) {
    if (item.tokenId && item.tokenName) {
      tokens.set(
        item.tokenId,
        new Token({
          id: item.tokenId,
          name: item.tokenName
        })
      )
    }
  }
}

async function mapAccountTokenEntities(
  ctx: Ctx,
  block: Block,
  data: TransferEventData[],
  accountTokens: Map<string, AccountToken>
) {
  for (const item of data) {
    if (item.to && item.tokenId) {
      // const tokenManagerBalance = new TokenManagerBalancesStorage(ctx, block)
      // const tokenBalance = await tokenManagerBalance.getAsV4([item.to, item.tokenId])
      accountTokens.set(
        `${item.to}-${item.tokenId}`,
        new AccountToken({
          accountId: item.to,
          tokenId: item.tokenId
          // balance: tokenBalance
        })
      )
    }
  }
}

function createTransfers(
  transfers: TransferEventData[],
  tokenTransfers: TokenTransfer[],
  accounts: Map<string, Account>,
  tokens: Map<string, Token>
): void {
  transfers.forEach(transfer => {
    tokenTransfers.push(
      new TokenTransfer({
        blockNumber: transfer.blockNumber,
        timestamp: transfer.timestamp,
        extrinsicHash: transfer.extrinsicHash,
        from: accounts.get(transfer.from ?? ''),
        to: accounts.get(transfer.to),
        amount: transfer.amount,
        token: tokens.get(transfer.tokenId ?? ''),
        pallet: transfer.pallet,
        method: transfer.method
      })
    )
  })
}
async function getTransfers(
  ctx: Ctx,
  tokenLookupMap: Map<string, string>,
  avtHash: string
): Promise<{
  accounts: Map<string, Account>
  tokens: Map<string, Token>
  accountTokens: Map<string, AccountToken>
  transfers: TokenTransfer[]
}> {
  const transfersData: TransferEventData[] = []
  const accounts: Map<string, Account> = new Map()
  const tokens: Map<string, Token> = new Map()
  const accountTokens: Map<string, AccountToken> = new Map()
  const transfers: TokenTransfer[] = []
  for (const block of ctx.blocks) {
    for (const item of block.items) {
      transfersData.push(
        handleTransfer(ctx, block.header, item as TransfersEventItem, tokenLookupMap, avtHash)
      )
      await mapAccountEntities(transfersData, accounts)
      await mapTokenEntities(transfersData, tokens)
      await mapAccountTokenEntities(ctx, block.header, transfersData, accountTokens)
      createTransfers(transfersData, transfers, accounts, tokens)
    }
  }
  return { accounts, tokens, accountTokens, transfers }
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

function handleTokenId(tokenId: Uint8Array) {
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
): { from: Uint8Array; to: Uint8Array; amount: bigint; tokenId: Uint8Array } {
  const e = new BalancesTransferEvent(ctx, item.event)
  if (e.isV4) {
    const { from, to, amount } = e.asV4
    return { from, to, amount, tokenId: decodeHex(avtHash) }
  } else {
    throw new UnknownVersionError()
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
    throw new UnknownVersionError()
  }
}

function normalizeTokenLiftedEvent(
  ctx: Ctx,
  item: EventItem<'TokenManager.TokenLifted', { event: { args: true } }>
): {
  from: undefined
  to: Uint8Array
  amount: bigint
  tokenId: Uint8Array
} {
  const e = new TokenManagerTokenLiftedEvent(ctx, item.event)
  if (e.isV4) {
    const { tokenId, recipient, tokenBalance, ethTxHash } = e.asV4
    return { from: undefined, to: recipient, amount: tokenBalance, tokenId }
  } else {
    throw new UnknownVersionError()
  }
}
function normalizeTokenLoweredEvent(
  ctx: Ctx,
  item: EventItem<'TokenManager.TokenLowered', { event: { args: true } }>
): {
  from: Uint8Array
  to: Uint8Array
  amount: bigint
  tokenId: Uint8Array
} {
  const e = new TokenManagerTokenLoweredEvent(ctx, item.event)
  if (e.isV4) {
    const { tokenId, recipient, sender, amount, t1Recipient } = e.asV4
    return { from: sender, to: recipient, amount, tokenId }
  } else {
    throw new UnknownVersionError()
  }
}

class UnknownVersionError extends Error {
  constructor() {
    super('Unknown version')
  }
}

processor.run(new TypeormDatabase(), processEvents)
