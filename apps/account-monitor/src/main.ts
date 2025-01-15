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
  CrossChainTransactionEvent,
  PredictionMarketAssetTransfer,
  PredictionMarketShareRedemption,
  PredictionMarketTokenWithdrawal,
  PredictionMarketTrade,
  PredictionMarketCreation
} from './model'
import { randomUUID } from 'crypto'
import processor, { predictionMarketCalls } from './processor'
import {
  Ctx,
  eventNames,
  NftTransferEventData,
  TokenTransferEventData,
  transactionEvents,
  TransferData,
  BaseTransferEvent,
  TransfersEventItem,
  Item
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
import { processPredictionMarketCall } from './chainCallHandlers'

async function createTokenLookupMap(ctx: Ctx): Promise<Map<string, string>> {
  const tokenLookupData = await getTokenLookupData(ctx)
  const tokenLookupMap = new Map<string, string>()

  tokenLookupData.forEach((token: TokenLookup) => {
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
  await getTransfers(ctx, tokenLookupMap, avtHash || '')
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

async function recordSchedulerEventData(
  ctx: Ctx,
  block: { items: any[] },
  item: any
): Promise<void> {
  if (item.kind !== 'event') return

  const events = block.items.filter((i: any) => i.kind === 'event')
  if (
    item.name === 'Scheduler.Scheduled' &&
    events.some((e: any) => e.kind === 'event' && e.name === 'TokenManager.LowerRequested')
  ) {
    const scheduledEvent = events.find(
      (e: any) => e.kind === 'event' && e.name === 'TokenManager.LowerRequested'
    )
    if (!scheduledEvent || scheduledEvent.kind !== 'event') return

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
      ctx.log.info('No record was found')
      return
    }
    record.name = item.name
    await ctx.store.save(record)
  } else if (item.name === 'Scheduler.Canceled') {
    const record = await ctx.store.findOne(ScheduledLowerTransaction, {
      where: { id: `${item.event.args.when}-${item.event.args.index}` }
    })
    if (!record) {
      ctx.log.info('No record was found')
      return
    }
    record.name = item.name
    await ctx.store.save(record)
  }
}

async function processTransferEvent(
  ctx: Ctx,
  transferEvent: any,
  block: SubstrateBlock
): Promise<void> {
  if (transferEvent.kind !== 'event') return

  const {
    name,
    event: { args, extrinsic }
  } = transferEvent

  const ethEventId = args?.ethEventId || {}
  const reason = args?.reason || {}
  const extrinsicData = extrinsic || {}

  const transaction = new CrossChainTransactionEvent()
  transaction.id = randomUUID()
  transaction.name = name
  transaction.ethEventIdSignature = ethEventId.signature || null
  transaction.ethEventIdTransactionHash = ethEventId.transactionHash || null
  transaction.extrinsicHash = extrinsicData.hash || null
  transaction.extrinsicIndexInBlock = extrinsicData.indexInBlock || null
  transaction.extrinsicSuccess = extrinsicData.success || false
  transaction.extrinsicBlockNumber = BigInt(block.height)
  transaction.rejectionReason = reason.dispatchError ? reason.dispatchError.toString() : null

  if (args && 'ethEventId' in args) {
    const { ethEventId, ...restArgs } = args
    transaction.args = restArgs
  } else {
    transaction.args = args || {}
  }
  await ctx.store.save(transaction)
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
      if (item.kind === 'event') {
        if (transactionEvents.includes(item.name)) {
          await processTransferEvent(ctx, item, block.header)
        }

        if (eventNames.includes(item.name)) {
          // Check if the event has the required properties for TransfersEventItem

          const transfer = getTransferData(
            ctx,
            block.header,
            // @ts-expect-error
            item as TransfersEventItem,
            tokenLookupMap,
            avtHash
          )
          if (
            transfer &&
            (transfer.pallet === 'TokenManager' || transfer.pallet === 'Balances') &&
            'amount' in transfer
          ) {
            transfersData.push(transfer as TokenTransferEventData)
          } else if (transfer && transfer.pallet === 'NftManager' && 'nftId' in transfer) {
            nftTransfersData.push(transfer as NftTransferEventData)
          }
        } else if (item.name.toLowerCase().includes('scheduler')) {
          await recordSchedulerEventData(ctx, block, item)
        }
      } else if (item.kind === 'call') {
        if (process.env.PREDICTION_MARKETS_ENABLED) {
          // @ts-expect-error
          const signedCallName = item.call.args?.call?.__kind
            ? `${item.call.args?.call?.__kind}.${item?.call?.args?.call?.value?.__kind}`
            : ''
          if (
            predictionMarketCalls.includes(item.call.name) ||
            predictionMarketCalls.includes(signedCallName)
          ) {
            await processPredictionMarketCall(ctx, item, block.header)
          }
        }
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
  const palletInfoArray = item.name.split('.')

  if (!event) throw new Error('Failed to get event data')

  if ('tokenId' in event) {
    return getTokenEventTransferData(block, item, event, tokensMap, palletInfoArray)
  }

  if ('nftId' in event) {
    return getNftEventTransferData(block, item, event, palletInfoArray)
  }

  return undefined
}

function getEventTransferData(
  block: SubstrateBlock,
  item: TransfersEventItem,
  event: any,
  palletInfoArray: string[]
): BaseTransferEvent {
  const payer = item.event?.call?.args?.paymentInfo?.payer

  const relayer =
    // @ts-expect-error
    item.event?.call?.origin?.value?.value?.value || item.event?.call?.origin?.value?.value

  return {
    id: item.event.id,
    blockNumber: block.height,
    timestamp: new Date(block.timestamp),
    extrinsicHash: item.event.extrinsic?.hash,
    from: event.from,
    to: event.to,
    pallet: palletInfoArray[0],
    method: palletInfoArray[1],
    payer: payer ? decodeHex(payer) : undefined,
    relayer: relayer ? decodeHex(relayer) : undefined,
    nonce: BigInt(item.event.extrinsic?.signature?.signedExtensions?.CheckNonce ?? 0)
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
  const tokenName = tokensMap.has(tokenId) ? tokensMap.get(tokenId) : undefined

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
    nftId: event.nftId.toString()
  }
}

function getKeyByValue(map: Map<string, string>, searchValue: string): string | undefined {
  for (const [key, value] of map.entries()) {
    if (value === searchValue) {
      return key
    }
  }
  return undefined
}

processor.run(new TypeormDatabase(), processEvents)
