import { Ctx, TransfersEventItem } from './types'
import {
  BalancesTransferEvent,
  NftManagerBatchCreatedEvent,
  NftManagerBatchNftMintedEvent,
  NftManagerFiatNftTransferEvent,
  NftManagerSingleNftMintedEvent,
  TokenManagerTokenLiftedEvent,
  TokenManagerTokenLoweredEvent,
  TokenManagerTokenTransferredEvent
} from './types/generated/parachain-testnet/events'
import { EventItem } from '@subsquid/substrate-processor/lib/interfaces/dataSelection'
import { decodeHex } from '@subsquid/substrate-processor'

export function normalizeBalancesTransferEvent(
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

export function normalizeTokenTransferEvent(
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

export function normalizeTokenLiftedEvent(
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
export function normalizeTokenLoweredEvent(
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

export function normalizeNftBatchCreated(
  ctx: Ctx,
  item: EventItem<'NftManager.BatchCreated', { event: { args: true } }>
) {
  const e = new NftManagerBatchCreatedEvent(ctx, item.event)
  if (e.isV4) {
    const { batchNftId, authority, batchCreator, totalSupply } = e.asV4
    return { from: undefined, to: batchCreator, nftId: batchNftId, totalSupply }
  } else {
    throw new UnknownVersionError()
  }
}

export function normalizeNftSingleNftMinted(
  ctx: Ctx,
  item: EventItem<'NftManager.SingleNftMinted', { event: { args: true } }>
) {
  const e = new NftManagerSingleNftMintedEvent(ctx, item.event)
  if (e.isV4) {
    const { authority, nftId, owner } = e.asV4
    return { from: undefined, to: owner, nftId, totalSupply: 1 }
  } else {
    throw new UnknownVersionError()
  }
}

export function normalizeNftBatchNftMinted(
  ctx: Ctx,
  item: EventItem<'NftManager.BatchNftMinted', { event: { args: true } }>
) {
  const e = new NftManagerBatchNftMintedEvent(ctx, item.event)
  if (e.isV4) {
    const { authority, batchNftId, nftId, owner } = e.asV4
    return { from: undefined, to: owner, nftId, totalSupply: 1 }
  } else {
    throw new UnknownVersionError()
  }
}

export function normalizeNftFiatNftTransfer(
  ctx: Ctx,
  item: EventItem<'NftManager.FiatNftTransfer', { event: { args: true } }>
) {
  const e = new NftManagerFiatNftTransferEvent(ctx, item.event)
  if (e.isV4) {
    const { newOwner, nftId, opId, saleType, sender } = e.asV4
    return { from: sender, to: newOwner, nftId, totalSupply: 1 }
  } else {
    throw new UnknownVersionError()
  }
}

class UnknownVersionError extends Error {
  constructor() {
    super('Unknown version')
  }
}

export function getEvent(ctx: Ctx, item: TransfersEventItem, avtHash: string) {
  switch (item.name) {
    case 'Balances.Transfer':
      return normalizeBalancesTransferEvent(ctx, item, avtHash)
    case 'TokenManager.TokenTransferred':
      return normalizeTokenTransferEvent(ctx, item)
    case 'TokenManager.TokenLifted':
      return normalizeTokenLiftedEvent(ctx, item)
    case 'TokenManager.TokenLowered':
      return normalizeTokenLoweredEvent(ctx, item)
    case 'NftManager.BatchCreated':
      return normalizeNftBatchCreated(ctx, item)
    case 'NftManager.SingleNftMinted':
      return normalizeNftSingleNftMinted(ctx, item)
    case 'NftManager.BatchNftMinted':
      return normalizeNftBatchNftMinted(ctx, item)
    case 'NftManager.FiatNftTransfer':
      return normalizeNftFiatNftTransfer(ctx, item)
  }
}
