import { getBalanceForAccount } from './chainEventHandlers'
import { Account, AccountNft, AccountToken, Nft, NftTransfer, Token, TokenTransfer } from './model'
import { Ctx, NftTransferEventData, TokenTransferEventData } from './types'
import { TokenManagerBalancesStorage } from './types/generated/parachain-dev/storage'
import { Block } from './types/generated/parachain-dev/support'
import { encodeId } from '@avn/utils'
import { toHex } from '@subsquid/substrate-processor'

export async function createTransfers(
  ctx: Ctx,
  transfers: TokenTransferEventData[],
  tokenTransfers: TokenTransfer[],
  accounts: Map<string, Account>,
  tokens: Map<string, Token>
): Promise<void> {
  for (const transfer of transfers) {
    const transferFrom = transfer.from ? encodeId(transfer.from) : undefined
    const transferTo = transfer.to ? encodeId(transfer.to) : undefined
    const transferRelayer = transfer.relayer ? encodeId(transfer.relayer) : undefined
    const transferPayer = transfer.payer ? encodeId(transfer.payer) : undefined
    const participants = [transferFrom, transferTo, transferRelayer, transferPayer]
    for (const address of participants) {
      if (address && !accounts.has(address)) {
        await createAndAddAccount(ctx, address, accounts)
      }
    }
    tokenTransfers.push(
      new TokenTransfer({
        blockNumber: transfer.blockNumber,
        timestamp: transfer.timestamp,
        extrinsicHash: transfer.extrinsicHash,
        from: transferFrom ? accounts.get(transferFrom) : undefined,
        to: transferTo ? accounts.get(transferTo) : undefined,
        relayer: transferRelayer ? accounts.get(transferRelayer) : undefined,
        payer: transferPayer ? accounts.get(transferPayer) : undefined,
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
  }
}

async function createAndAddAccount(
  ctx: Ctx,
  account: string,
  accounts: Map<string, Account>
): Promise<void> {
  try {
    const existingAccount = await ctx.store.findOne(Account, { where: { id: account } })

    if (existingAccount) {
      accounts.set(account, existingAccount)
    } else {
      const newAccount = new Account({
        id: account,
        avtBalance: BigInt(0)
      })
      accounts.set(account, newAccount)
    }
  } catch (e: any) {
    console.error(`Error in createAndAddAccount while accessing the database: ${e.message}`)
  }
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
    if (item.to?.length && item.tokenId?.length) {
      const tokenId = toHex(item.tokenId)
      const accountId = encodeId(item.to)
      const tokenManagerBalance = new TokenManagerBalancesStorage(ctx, block)
      const tokenBalance = await tokenManagerBalance.asV58.get([item.tokenId, item.to])
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

async function updateAccounts(
  ctx: Ctx,
  block: Block,
  accounts: Map<string, Account>,
  data: Array<TokenTransferEventData | NftTransferEventData>
): Promise<void> {
  for (const item of data) {
    if (item?.from?.length) await updateAccount(ctx, block, accounts, item.from)
    if (item?.to?.length) await updateAccount(ctx, block, accounts, item.to)
    if (item?.relayer?.length) await updateAccount(ctx, block, accounts, item.relayer)
    if (item?.payer?.length) await updateAccount(ctx, block, accounts, item.payer)
  }
}

async function updateAccount(
  ctx: Ctx,
  block: Block,
  accounts: Map<string, Account>,
  address: Uint8Array
): Promise<void> {
  const accountId = encodeId(address)

  if (accountId) {
    const balance = await getBalanceForAccount(ctx, block, address)
    const avtBalance = BigInt(balance ? balance.free + balance.reserved : 0)
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
  await updateAccounts(ctx, block, accounts, data)

  ctx.log.child('state').info(`mapping accounts ${accounts.size}`)
}
