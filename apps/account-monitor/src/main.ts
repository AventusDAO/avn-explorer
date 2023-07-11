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
  SystemAccountStorage,
  BalancesAccountStorage,
  TokenManagerBalancesStorage
} from './types/generated/parachain-testnet/storage'
import { Block } from './types/generated/parachain-testnet/support'
import {
  Ctx,
  NftTransferEventData,
  TokenTransferEventData,
  TransferData,
  TransferEventData,
  TransfersEventItem
} from './types'
import { getEvent } from './chainEventHandlers'

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

async function mapAccountEntities(
  ctx: Ctx,
  block: Block,
  data: TokenTransferEventData[] | NftTransferEventData[],
  accounts: Map<string, Account>
) {
  const addressSet = new Set<Uint8Array>()
  const encodeIdCache = new Map<Uint8Array, string>()

  for (const item of data) {
    addressSet.add(item.from)
    addressSet.add(item.to)
  }

  for (const address of addressSet) {
    let encodedId = encodeIdCache.get(address) ?? ''
    if (!encodedId && address) {
      encodedId = encodeId(address)
      encodeIdCache.set(address, encodedId)
    }
  }

  const addresses = Array.from(addressSet)
  const balances = await getBalances(ctx, block, addresses)

  if (balances) {
    for (const item of data) {
      const fromId = encodeIdCache.get(item.from)
      const accountBalanceFrom = balances.shift()
      if (fromId && accountBalanceFrom) {
        accounts.set(
          fromId,
          new Account({
            id: fromId,

            avtBalance: accountBalanceFrom.free
          })
        )
      }

      const toId = encodeIdCache.get(item.to)
      const accountBalanceTo = balances.shift()
      if (toId && accountBalanceTo) {
        accounts.set(
          toId,
          new Account({
            id: toId,

            avtBalance: accountBalanceTo.free
          })
        )
      }
    }
  }
  ctx.log.child('state').info(`mapping accounts ${accounts.size}`)
}

async function getBalances(ctx: Ctx, block: Block, accounts: Uint8Array[]) {
  ctx.log.child('state').info(`getting accounts balance`)
  return (
    (await getSystemAccountBalances(ctx, block, accounts)) ??
    (await getBalancesAccountBalances(ctx, block, accounts))
  )
}

async function getBalancesAccountBalances(ctx: Ctx, block: Block, accounts: Uint8Array[]) {
  const storage = new BalancesAccountStorage(ctx, block)
  if (!storage.isExists) return undefined

  const data = await storage.asV4.getMany(accounts.filter(Boolean))

  return data.map((d: any) => ({ free: d.free, reserved: d.reserved }))
}

async function getSystemAccountBalances(ctx: Ctx, block: Block, accounts: Uint8Array[]) {
  const storage = new SystemAccountStorage(ctx, block)
  if (!storage.isExists) return undefined
  const data = await storage.asV4.getMany(accounts.filter(Boolean))

  return data.map((d: any) => ({
    free: d.data.free,
    reserved: d.data.reserved
  }))
}

function mapTokenEntities(ctx: Ctx, data: TokenTransferEventData[], tokens: Map<string, Token>) {
  for (const item of data) {
    if (item.tokenId) {
      const tokenId = toHex(item.tokenId)
      tokens.set(
        tokenId,
        new Token({
          id: tokenId,
          name: item.tokenName
        })
      )
    }
  }
  ctx.log.child('state').info(`mapping tokens ${tokens.size}`)
}

function mapNftEntities(ctx: Ctx, data: NftTransferEventData[], nfts: Map<string, Nft>) {
  for (const item of data) {
    if (item.nftId) {
      nfts.set(
        item.nftId,
        new Nft({
          id: item.nftId
        })
      )
    }
  }
  ctx.log.child('state').info(`mapping nfts ${nfts.size}`)
}

async function mapAccountTokenEntities(
  ctx: Ctx,
  block: Block,
  data: TokenTransferEventData[],
  accountTokens: Map<string, AccountToken>,
  avtHash: string
) {
  for (const item of data) {
    if (item.to && item.tokenId) {
      const tokenId = toHex(item.tokenId)
      const accountId = encodeId(item.to)
      const tokenManagerBalance = new TokenManagerBalancesStorage(ctx, block)
      const tokenBalance = await tokenManagerBalance.asV4.get([item.tokenId, item.to])
      if (tokenBalance > 0) {
        accountTokens.set(
          `${accountId}-${tokenId}`,
          new AccountToken({
            accountId,
            tokenId,
            balance: tokenBalance
          })
        )
      }
    }
  }
  ctx.log.child('state').info(`mapping account-tokens ${accountTokens.size}`)
}

async function mapAccountNftEntities(
  ctx: Ctx,
  data: NftTransferEventData[],
  accountNfts: Map<string, AccountNft>
) {
  for (const item of data) {
    if (item.to && item.nftId) {
      const accountId = encodeId(item.to)
      accountNfts.set(
        `${accountId}-${item.nftId}`,
        new AccountNft({
          accountId,
          nftId: item.nftId
        })
      )
    }
  }
  ctx.log.child('state').info(`mapping account-nfts ${accountNfts.size}`)
}

function createTransfers(
  transfers: TokenTransferEventData[],
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
        from: transfer.from ? accounts.get(encodeId(transfer.from)) : undefined,
        to: accounts.get(encodeId(transfer.to)),
        amount: transfer.amount,
        token: tokens.get(toHex(transfer.tokenId) ?? ''),
        pallet: transfer.pallet,
        method: transfer.method
      })
    )
  })
}

function createNftTransfers(
  transfers: NftTransferEventData[],
  nftTransfers: NftTransfer[],
  accounts: Map<string, Account>,
  nfts: Map<string, Nft>
): void {
  transfers.forEach(transfer => {
    nftTransfers.push(
      new NftTransfer({
        blockNumber: transfer.blockNumber,
        timestamp: transfer.timestamp,
        extrinsicHash: transfer.extrinsicHash,
        from: transfer.from && accounts.get(encodeId(transfer.from)),
        to: accounts.get(encodeId(transfer.to)),
        nft: nfts.get(transfer.nftId ?? ''),
        pallet: transfer.pallet,
        method: transfer.method
      })
    )
  })
}
type DataToBeSaved = {
  accounts: Map<string, Account>
  tokens: Map<string, Token>
  accountTokens: Map<string, AccountToken>
  transfers: TokenTransfer[]
  nfts: Map<string, Nft>
  accountNfts: Map<string, AccountNft>
  nftTransfers: NftTransfer[]
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
