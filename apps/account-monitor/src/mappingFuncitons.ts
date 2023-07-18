import { getBalances } from './chainEventHandlers'
import { Account, AccountNft, AccountToken, Nft, NftTransfer, Token, TokenTransfer } from './model'
import { Ctx, NftTransferEventData, TokenTransferEventData } from './types'
import { TokenManagerBalancesStorage } from './types/generated/parachain-testnet/storage'
import { Block } from './types/generated/parachain-testnet/support'
import { encodeId } from '@avn/utils'
import { toHex } from '@subsquid/substrate-processor'

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
        to: accounts.get(encodeId(transfer.to)),
        amount: transfer.amount,
        token: tokens.get(toHex(transfer.tokenId) ?? ''),
        pallet: transfer.pallet,
        method: transfer.method
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
        from: transfer.from && accounts.get(encodeId(transfer.from)),
        to: accounts.get(encodeId(transfer.to)),
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
) {
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

export function mapNftEntities(ctx: Ctx, data: NftTransferEventData[], nfts: Map<string, Nft>) {
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

export async function mapAccountNftEntities(
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

export async function mapAccountEntities(
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
            avtBalance: accountBalanceFrom.free + accountBalanceFrom.reserved
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
            avtBalance: accountBalanceTo.free + accountBalanceTo.reserved
          })
        )
      }
    }
  }
  ctx.log.child('state').info(`mapping accounts ${accounts.size}`)
}
