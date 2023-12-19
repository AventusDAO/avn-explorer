import { getBalances } from './chainEventHandlers'
import { Account, AccountNft, AccountToken, Nft, NftTransfer, Token, TokenTransfer } from './model'
import { BalanceType, Ctx, NftTransferEventData, TokenTransferEventData } from './types'
import { TokenManagerBalancesStorage } from './types/generated/parachain-dev/storage'
import { Block } from './types/generated/parachain-dev/support'
import { encodeId } from '@avn/utils'
import { toHex, decodeHex } from '@subsquid/substrate-processor'

export function createTransfers(
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
        to: transfer.to ? accounts.get(encodeId(transfer.to)) : undefined,
        relayer: transfer.relayer ? accounts.get(encodeId(transfer.relayer)) : undefined,
        payer: transfer.payer?.length ? accounts.get(encodeId(transfer.payer)) : undefined,
        nonce: transfer.nonce,
        amount: transfer.amount,
        token: tokens.get(toHex(transfer.tokenId) ?? ''),
        pallet: transfer.pallet,
        method: transfer.method,
        lowerId: transfer.lowerId,
        scheduleName: transfer.scheduleName ? toHex(transfer.scheduleName) : '',
        senderNonce: transfer.senderNonce,
        t1Recipient: transfer.t1Recipient ? toHex(transfer.t1Recipient) : undefined
      })
    )
  })
}

export function createNftTransfers(
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
        from: transfer.from ? accounts.get(encodeId(transfer.from)) : undefined,
        to: accounts.get(encodeId(transfer.to)),
        relayer: transfer.relayer ? accounts.get(encodeId(transfer.relayer)) : undefined,
        nonce: transfer.nonce,
        nft: nfts.get(transfer.nftId ?? ''),
        pallet: transfer.pallet,
        method: transfer.method
      })
    )
  })
}

export function mapTokenEntities(
  ctx: Ctx,
  data: TokenTransferEventData[],
  tokens: Map<string, Token>
): void {
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

export function mapNftEntities(
  ctx: Ctx,
  data: NftTransferEventData[],
  nfts: Map<string, Nft>
): void {
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

export async function mapAccountTokenEntities(
  ctx: Ctx,
  block: Block,
  data: TokenTransferEventData[],
  accountTokens: Map<string, AccountToken>
  // avtHash: string
): Promise<void> {
  for (const item of data) {
    if (item.to && item.tokenId) {
      const tokenId = toHex(item.tokenId)
      const accountId = encodeId(item.to)
      const tokenManagerBalance = new TokenManagerBalancesStorage(ctx, block)
      const tokenBalance = await tokenManagerBalance.asV31.get([item.tokenId, item.to])
      if (tokenBalance > 0) {
        accountTokens.set(
          `${accountId}-${tokenId}`,
          new AccountToken({
            id: `${accountId}-${tokenId}`,
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

export async function mapAccountNftEntities(
  ctx: Ctx,
  data: NftTransferEventData[],
  accountNfts: Map<string, AccountNft>
): Promise<void> {
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

function extractAddresses(
  data: Array<TokenTransferEventData | NftTransferEventData>
): Set<Uint8Array> {
  const addressSet = new Set<Uint8Array>()

  for (const item of data) {
    addressSet.add(item.from)
    addressSet.add(item.to)
    addressSet.add(item.relayer)
    addressSet.add(item.payer)
  }

  return addressSet
}

function createEncodeIdCache(addresses: Set<Uint8Array>): Map<Uint8Array, string> {
  const encodeIdCache = new Map<Uint8Array, string>()

  for (const address of addresses) {
    const encodedId = encodeIdCache.get(address) ?? ''

    if (!encodedId && address && address.length) {
      const encoded = encodeId(address)
      encodeIdCache.set(address, encoded)
    }
  }

  return encodeIdCache
}

function updateAccounts(
  accounts: Map<string, Account>,
  encodeIdCache: Map<Uint8Array, string>,
  balances: BalanceType[],
  data: Array<TokenTransferEventData | NftTransferEventData>
): void {
  for (const item of data) {
    updateAccount(accounts, encodeIdCache, balances, item.relayer)
    updateAccount(accounts, encodeIdCache, balances, item.to)
    updateAccount(accounts, encodeIdCache, balances, item.from)
    updateAccount(accounts, encodeIdCache, balances, item.payer)
  }
}

function updateAccount(
  accounts: Map<string, Account>,
  encodeIdCache: Map<Uint8Array, string>,
  balances: BalanceType[],
  address: Uint8Array
): void {
  const accountId = encodeIdCache.get(address)
  const accountBalance: BalanceType | undefined = balances.pop()

  if (accountId && accountBalance) {
    const avtBalance: bigint | number = accountBalance.free + accountBalance.reserved
    accounts.set(
      accountId,
      new Account({
        id: accountId,
        avtBalance
      })
    )
  }
}

export async function mapAccountEntities(
  ctx: Ctx,
  block: Block,
  data: TokenTransferEventData[] | NftTransferEventData[],
  accounts: Map<string, Account>
): Promise<void> {
  const addressSet = extractAddresses(data)
  const encodeIdCache = createEncodeIdCache(addressSet)
  const balances = await getBalances(ctx, block, [...addressSet])
  if (balances) {
    updateAccounts(accounts, encodeIdCache, balances, data)
  }

  ctx.log.child('state').info(`mapping accounts ${accounts.size}`)
}
