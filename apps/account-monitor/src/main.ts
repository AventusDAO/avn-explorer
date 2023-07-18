import { SubstrateBlock, toHex } from '@subsquid/substrate-processor'
import { encodeId } from '@avn/utils'
import { TypeormDatabase } from '@subsquid/typeorm-store'
import {
  TokenTransfer,
  TokenLookup,
  Account,
  Token,
  AccountToken,
  Nft,
  AccountNft,
  NftTransfer
} from './model'
import processor from './processor'
import {
  Ctx,
  NftTransferEventData,
  TokenTransferEventData,
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

async function getTokenLookupData(ctx: Ctx) {
  return await ctx.store.find(TokenLookup, { where: {} })
}

let tokenLookupMap: Map<string, string> | null = null

async function processEvents(ctx: Ctx) {
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
) {
  await recordTokenTransferData(ctx, accounts, tokens, accountTokens, transfers)
  await recordNftTransferData(ctx, accounts, nfts, accountNfts, nftTransfers)
}

async function recordTokenTransferData(
  ctx: Ctx,
  accounts: Map<string, Account>,
  tokens: Map<string, Token>,
  accountTokens: Map<string, AccountToken>,
  transfers: TokenTransfer[]
) {
  await ctx.store.save([...accounts.values()])
  await ctx.store.save([...tokens.values()])
  await ctx.store.save([...accountTokens.values()])
  await ctx.store.insert(transfers)
  ctx.log.child('state').info(`saved token transfers ${transfers.length}`)
}

async function saveAccountToken(ctx: Ctx, accountTokens: AccountToken[]) {
  for (const accountToken of accountTokens) {
    const existing = (await ctx.store.find(AccountToken, {
      where: { accountId: accountToken.accountId, tokenId: accountToken.tokenId }
    })) as unknown as AccountToken
    if (existing) {
      existing.balance = accountToken.balance
      await ctx.store.save<AccountToken>(existing)
    } else {
      await ctx.store.save(accountToken)
    }
  }
}

async function recordNftTransferData(
  ctx: Ctx,
  accounts: Map<string, Account>,
  nfts: Map<string, Nft>,
  accountNfts: Map<string, AccountNft>,
  nftTransfers: NftTransfer[]
) {
  await ctx.store.save([...accounts.values()])
  await ctx.store.save([...nfts.values()])
  await ctx.store.save([...accountNfts.values()])
  await ctx.store.insert(nftTransfers)
}

async function getTransfers(ctx: Ctx, tokenLookupMap: Map<string, string>, avtHash: string) {
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
      const transfer = getTransferData(
        ctx,
        block.header,
        item as TransfersEventItem,
        tokenLookupMap,
        avtHash
      )
      if (transfer?.pallet === 'TokenManager' && 'amount' in transfer) {
        transfersData.push(transfer)
      } else if (transfer?.pallet === 'NftManager' && 'nftId' in transfer) {
        nftTransfersData.push(transfer)
      }
    }
    await mapAccountEntities(ctx, block.header, transfersData, accounts)
    await mapTokenEntities(ctx, transfersData, tokens)
    await mapAccountTokenEntities(ctx, block.header, transfersData, accountTokens, avtHash)
    createTransfers(transfersData, transfers, accounts, tokens)
    await mapAccountEntities(ctx, block.header, nftTransfersData, accounts)
    await mapNftEntities(ctx, nftTransfersData, nfts)
    await mapAccountNftEntities(ctx, nftTransfersData, accountNfts)
    createNftTransfers(nftTransfersData, nftTransfers, accounts, nfts)
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
  return {
    id: item.event.id,
    blockNumber: block.height,
    timestamp: new Date(block.timestamp),
    extrinsicHash: item.event.extrinsic?.hash,
    from: event.from,
    to: event.to,
    pallet: palletInfoArray[0],
    method: palletInfoArray[1]
  }
}

function getTokenEventTransferData(
  block: SubstrateBlock,
  item: TransfersEventItem,
  event: any,
  tokensMap: Map<string, string>,
  palletInfoArray: string[]
): TokenTransferEventData {
  const tokenId = event.tokenId
  const tokenName = tokensMap.has(tokenId) ? tokensMap.get(tokenId) : ''

  return {
    ...getEventTransferData(block, item, event, palletInfoArray),
    amount: event.amount,
    tokenName,
    tokenId: tokenId
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
