import { decodeHex, SubstrateBlock, toHex } from '@subsquid/substrate-processor'
import { TypeormDatabase } from '@subsquid/typeorm-store'
import {
  TokenTransfer,
  TokenLookup,
  Account,
  Token,
  AccountToken,
  Nft,
  AccountNft,
  NftTransfer,
  ScheduledLowerTransaction,
  TransactionEvent
} from './model'
import { randomUUID } from 'crypto'
import processor from './processor'
import {
  Ctx,
  eventNames,
  NftTransferEventData,
  TokenTransferEventData,
  transactionEvents,
  TransferData,
  TransferEventData,
  TransfersEventItem
} from './types'
import { getEvent } from './chainEventHandlers'
import {
  createNftTransfers,
  createTransfers,
  mapAccountEntities,
  mapAccountNftEntities,
  mapAccountTokenEntities,
  mapNftEntities,
  mapTokenEntities
} from './mappingFuncitons'

async function createTokenLookupMap(ctx: Ctx): Promise<Map<any, any>> {
  const tokenLookupData = await getTokenLookupData(ctx)
  const tokenLookupMap = new Map<string, string>()

  tokenLookupData.forEach((token: any) => {
    tokenLookupMap.set(token.tokenId, token.tokenName)
  })
  return tokenLookupMap
}

async function getTokenLookupData(ctx: Ctx): Promise<TokenLookup[]> {
  return await ctx.store.find(TokenLookup, { where: {} })
}

let tokenLookupMap: Map<string, string> | null = null

async function processEvents(ctx: Ctx): Promise<void> {
  if (!tokenLookupMap) {
    tokenLookupMap = await createTokenLookupMap(ctx)
  }

  const avtHash = getKeyByValue(tokenLookupMap, 'AVT')
  ctx.log.child('state').info(`getting transfers`)
  await getTransfers(ctx, tokenLookupMap, avtHash)
  ctx.log.child('state').info(`recording at block`)
}

async function recordTransferData(
  ctx: Ctx,
  accounts: Map<string, Account>,
  tokens: Map<string, Token>,
  accountTokens: Map<string, AccountToken>,
  transfers: TokenTransfer[],
  nfts: Map<string, Nft>,
  accountNfts: Map<string, AccountNft>,
  nftTransfers: NftTransfer[]
): Promise<void> {
  await recordTokenTransferData(ctx, accounts, tokens, accountTokens, transfers)
  await recordNftTransferData(ctx, accounts, nfts, accountNfts, nftTransfers)
}

async function recordTokenTransferData(
  ctx: Ctx,
  accounts: Map<string, Account>,
  tokens: Map<string, Token>,
  accountTokens: Map<string, AccountToken>,
  transfers: TokenTransfer[]
): Promise<void> {
  await ctx.store.save([...accounts.values()])
  await ctx.store.save([...tokens.values()])
  await ctx.store.save([...accountTokens.values()])
  await ctx.store.insert(transfers)
  ctx.log.child('state').info(`saved token transfers ${transfers.length}`)
}

async function recordNftTransferData(
  ctx: Ctx,
  accounts: Map<string, Account>,
  nfts: Map<string, Nft>,
  accountNfts: Map<string, AccountNft>,
  nftTransfers: NftTransfer[]
): Promise<void> {
  await ctx.store.save([...accounts.values()])
  await ctx.store.save([...nfts.values()])
  await ctx.store.save([...accountNfts.values()])
  await ctx.store.insert(nftTransfers)
}

async function recordSchedulerEventData(ctx: Ctx, block: any, item: any) {
  const events = block.items.filter((i: any) => i.kind === 'event')
  if (
    item.name === 'Scheduler.Scheduled' &&
    events.some((e: any) => e.name === 'TokenManager.LowerRequested')
  ) {
    const scheduledEvent = events.find((e: any) => e.name === 'TokenManager.LowerRequested')
    const record = new ScheduledLowerTransaction()
    record.id = `${item.event.args.when}-${item.event.args.index}`
    record.name = item.name
    record.scheduledTransactionName = scheduledEvent.name
    record.from = scheduledEvent.event.args.from
    record.amount = scheduledEvent.event.args.amount
    record.lowerId = scheduledEvent.event.args.lowerId
    record.tokenId = scheduledEvent.event.args.tokenId
    record.t1Recipient = scheduledEvent.event.args.t1Recipient
    await ctx.store.save(record)
  } else if (item.name === 'Scheduler.Dispatched') {
    const record = await ctx.store.findOne(ScheduledLowerTransaction, {
      where: { id: `${item.event.args.task[0]}-${item.event.args.task[1]}` }
    })
    if (!record) {
      console.log('No record was found')
      return
    }
    record.name = item.name
    await ctx.store.upsert(record)
  } else if (item.name === 'Scheduler.Canceled') {
    const record = await ctx.store.findOne(ScheduledLowerTransaction, {
      where: { id: `${item.event.args.when}-${item.event.args.index}` }
    })
    if (!record) {
      console.log('No record was found')
      return
    }
    record.name = item.name
    await ctx.store.upsert(record)
  }
}

async function processTransferEvent(
  ctx: Ctx,
  transferEvent: any,
  block: SubstrateBlock
): Promise<void> {
  const transaction = new TransactionEvent()
  transaction.id = randomUUID()
  transaction.args = transferEvent.event.args
  transaction.name = transferEvent.name
  transaction.extrinsicHash = transferEvent.event.extrinsic.hash
  transaction.extrinsicIndexInBlock = transferEvent.event.extrinsic.indexInBlock
  transaction.extrinsicSuccess = transferEvent.event.extrinsic.success
  transaction.extrinsicBlockNumber = BigInt(block.height)
  await ctx.store.upsert(transaction)
}

async function getTransfers(
  ctx: Ctx,
  tokenLookupMap: Map<string, string>,
  avtHash: string
): Promise<void> {
  for (const block of ctx.blocks) {
    const transfersData: TokenTransferEventData[] = []
    const nftTransfersData: NftTransferEventData[] = []
    const accounts: Map<string, Account> = new Map()
    const tokens: Map<string, Token> = new Map()
    const accountTokens: Map<string, AccountToken> = new Map()
    const transfers: TokenTransfer[] = []
    const nfts: Map<string, Nft> = new Map()
    const accountNfts: Map<string, AccountNft> = new Map()
    const nftTransfers: NftTransfer[] = []
    for (const item of block.items) {
      if (item.kind === 'event' && transactionEvents.includes(item.name)) {
        await processTransferEvent(ctx, item, block.header)
      }

      if (item.kind === 'event' && eventNames.includes(item.name)) {
        console.log('running')
        const transfer = getTransferData(
          ctx,
          block.header,
          item as TransfersEventItem,
          tokenLookupMap,
          avtHash
        )
        if (
          (transfer?.pallet === 'TokenManager' || transfer?.pallet === 'Balances') &&
          'amount' in transfer
        ) {
          transfersData.push(transfer)
        } else if (transfer?.pallet === 'NftManager' && 'nftId' in transfer) {
          nftTransfersData.push(transfer)
        }
      } else if (item.kind === 'event' && item.name.toLowerCase().includes('scheduler')) {
        await recordSchedulerEventData(ctx, block, item)
      }
    }
    await processMappingData(
      ctx,
      block.header,
      transfers,
      nftTransfers,
      transfersData,
      nftTransfersData,
      accounts,
      tokens,
      accountTokens,
      nfts,
      accountNfts
    )
    await recordTransferData(
      ctx,
      accounts,
      tokens,
      accountTokens,
      transfers,
      nfts,
      accountNfts,
      nftTransfers
    )
  }
}

async function processMappingData(
  ctx: Ctx,
  block: SubstrateBlock,
  transfers: TokenTransfer[],
  nftTransfers: NftTransfer[],
  transfersData: TokenTransferEventData[],
  nftTransfersData: NftTransferEventData[],
  accounts: Map<string, Account>,
  tokens: Map<string, Token>,
  accountTokens: Map<string, AccountToken>,
  nfts: Map<string, Nft>,
  accountNfts: Map<string, AccountNft>
): Promise<void> {
  await Promise.all([
    mapAccountEntities(ctx, block, transfersData, accounts),
    mapTokenEntities(ctx, transfersData, tokens),
    mapAccountTokenEntities(ctx, block, transfersData, accountTokens),
    mapAccountEntities(ctx, block, nftTransfersData, accounts),
    mapNftEntities(ctx, nftTransfersData, nfts),
    mapAccountNftEntities(ctx, nftTransfersData, accountNfts)
  ])
  await createTransfers(ctx, transfersData, transfers, accounts, tokens)
  createNftTransfers(nftTransfersData, nftTransfers, accounts, nfts)
}

function getTransferData(
  ctx: Ctx,
  block: SubstrateBlock,
  item: TransfersEventItem,
  tokensMap: Map<string, string>,
  avtHash: string
): TransferData {
  const event = getEvent(ctx, item, avtHash)
  if (!event) throw new Error()
  const palletInfoArray = item.name.split('.')
  if (event && Object.keys(event).includes('tokenId')) {
    const tokenTransfer = getTokenEventTransferData(block, item, event, tokensMap, palletInfoArray)
    return tokenTransfer
  }

  if (event && Object.keys(event).includes('nftId')) {
    return getNftEventTransferData(block, item, event, palletInfoArray)
  }

  return undefined
}

function getEventTransferData(
  block: SubstrateBlock,
  item: TransfersEventItem,
  event: any,
  palletInfoArray: string[]
): TransferEventData {
  const payer = item.event?.call?.args?.paymentInfo?.payer
  return {
    id: item.event.id,
    blockNumber: block.height,
    timestamp: new Date(block.timestamp),
    extrinsicHash: item.event.extrinsic?.hash,
    from: event.from,
    to: event.to,
    pallet: palletInfoArray[0],
    method: palletInfoArray[1],
    payer: payer ? decodeHex(payer) : new Uint8Array(),
    // @ts-expect-error
    relayer: item.event?.call?.origin?.value?.value
      ? // @ts-expect-error
        decodeHex(item.event.call?.origin.value.value)
      : undefined,
    nonce: item.event.extrinsic?.signature?.signedExtensions?.CheckNonce ?? 0
  }
}

function getTokenEventTransferData(
  block: SubstrateBlock,
  item: TransfersEventItem,
  event: any,
  tokensMap: Map<string, string>,
  palletInfoArray: string[]
): TokenTransferEventData {
  const tokenId = toHex(event.tokenId)
  const tokenName = tokensMap.has(tokenId) ? tokensMap.get(tokenId) : ''

  return {
    ...getEventTransferData(block, item, event, palletInfoArray),
    amount: event.amount,
    tokenName,
    tokenId: event.tokenId,
    lowerId: event.lowerId,
    scheduleName: event.scheduleName,
    senderNonce: event.senderNonce,
    t1Recipient: event.t1Recipient
  }
}

function getNftEventTransferData(
  block: SubstrateBlock,
  item: TransfersEventItem,
  event: any,
  palletInfoArray: string[]
): NftTransferEventData {
  return {
    ...getEventTransferData(block, item, event, palletInfoArray),
    nftId: event.nftId
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

processor.run(new TypeormDatabase(), processEvents)
