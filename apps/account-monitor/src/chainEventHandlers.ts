import { BalanceType, Ctx, EventName, EventNormalizers, TransfersEventItem } from './types'
import {
  BalancesBalanceSetEvent,
  BalancesDepositEvent,
  BalancesEndowedEvent,
  BalancesReserveRepatriatedEvent,
  BalancesReservedEvent,
  BalancesSlashedEvent,
  BalancesTransferEvent,
  BalancesUnreservedEvent,
  BalancesWithdrawEvent,
  NftManagerBatchCreatedEvent,
  NftManagerBatchNftMintedEvent,
  NftManagerEthNftTransferEvent,
  NftManagerFiatNftTransferEvent,
  NftManagerSingleNftMintedEvent,
  TokenManagerTokenLiftedEvent,
  TokenManagerTokenLoweredEvent,
  TokenManagerAvtLoweredEvent,
  TokenManagerTokenTransferredEvent,
  TokenManagerAvtLiftedEvent
} from './types/generated/parachain-testnet/events'
import { TokenManagerLowerRequestedEvent } from './types/generated/parachain-dev/events'
import { EventItem } from '@subsquid/substrate-processor/lib/interfaces/dataSelection'
import { decodeHex } from '@subsquid/substrate-processor'
import {
  BalancesAccountStorage,
  SystemAccountStorage
} from './types/generated/parachain-testnet/storage'
import { Block } from './types/generated/parachain-testnet/support'
import { AccountInfo } from './types/generated/parachain-testnet/v4'

export function normalizeBalancesTransferEvent(
  ctx: Ctx,
  item: EventItem<
    'Balances.Transfer',
    { event: { args: true }; call: { origin: true; args: true } }
  >,
  avtHash?: string
): { from: Uint8Array; to: Uint8Array; amount: bigint; tokenId: Uint8Array } {
  const e = new BalancesTransferEvent(ctx, item.event)

  if (e.isV4) {
    const { from, to, amount } = e.asV4
    return {
      from,
      to,
      amount,
      tokenId: avtHash ? decodeHex(avtHash) : /* this should not be reached */ new Uint8Array()
    }
  } else {
    throw new UnknownVersionError()
  }
}

export function normalizeBalancesEndowedEvent(
  ctx: Ctx,
  item: EventItem<
    'Balances.Endowed',
    { event: { args: true }; call: { origin: true; args: true } }
  >,
  avtHash?: string
): { from: Uint8Array; to: Uint8Array; amount: bigint; tokenId: Uint8Array } {
  const e = new BalancesEndowedEvent(ctx, item.event)

  if (e.isV4) {
    const { account, freeBalance } = e.asV4
    return {
      from: account,
      to: account,
      amount: freeBalance,
      tokenId: avtHash ? decodeHex(avtHash) : /* this should not be reached */ new Uint8Array()
    }
  } else {
    throw new UnknownVersionError()
  }
}

export function normalizeBalancesBalanceSetEvent(
  ctx: Ctx,
  item: EventItem<
    'Balances.BalanceSet',
    { event: { args: true }; call: { origin: true; args: true } }
  >,
  avtHash?: string
): { from: Uint8Array; to: Uint8Array; amount: bigint; tokenId: Uint8Array } {
  const e = new BalancesBalanceSetEvent(ctx, item.event)

  if (e.isV4) {
    const { free, reserved, who } = e.asV4
    return {
      from: new Uint8Array(),
      to: who,
      amount: free + reserved,
      tokenId: avtHash ? decodeHex(avtHash) : /* this should not be reached */ new Uint8Array()
    }
  } else {
    throw new UnknownVersionError()
  }
}

export function normalizeBalancesReservedEvent(
  ctx: Ctx,
  item: EventItem<
    'Balances.Reserved',
    { event: { args: true }; call: { origin: true; args: true } }
  >,
  avtHash?: string
): { from: Uint8Array; to: Uint8Array; amount: bigint; tokenId: Uint8Array } {
  const e = new BalancesReservedEvent(ctx, item.event)

  if (e.isV4) {
    const { amount, who } = e.asV4
    return {
      from: who,
      to: who,
      amount,
      tokenId: avtHash ? decodeHex(avtHash) : /* this should not be reached */ new Uint8Array()
    }
  } else {
    throw new UnknownVersionError()
  }
}

export function normalizeBalancesUnreservedEvent(
  ctx: Ctx,
  item: EventItem<
    'Balances.Unreserved',
    { event: { args: true }; call: { origin: true; args: true } }
  >,
  avtHash?: string
): { from: Uint8Array; to: Uint8Array; amount: bigint; tokenId: Uint8Array } {
  const e = new BalancesUnreservedEvent(ctx, item.event)

  if (e.isV4) {
    const { amount, who } = e.asV4
    return {
      from: who,
      to: who,
      amount,
      tokenId: avtHash ? decodeHex(avtHash) : /* this should not be reached */ new Uint8Array()
    }
  } else {
    throw new UnknownVersionError()
  }
}

export function normalizeBalancesReserveRepatriatedEvent(
  ctx: Ctx,
  item: EventItem<
    'Balances.ReserveRepatriated',
    { event: { args: true }; call: { origin: true; args: true } }
  >,
  avtHash?: string
): { from: Uint8Array; to: Uint8Array; amount: bigint; tokenId: Uint8Array } {
  const e = new BalancesReserveRepatriatedEvent(ctx, item.event)

  if (e.isV4) {
    const { amount, from, to } = e.asV4
    return {
      from,
      to,
      amount,
      tokenId: avtHash ? decodeHex(avtHash) : /* this should not be reached */ new Uint8Array()
    }
  } else {
    throw new UnknownVersionError()
  }
}

export function normalizeBalancesDepositEvent(
  ctx: Ctx,
  item: EventItem<
    'Balances.Deposit',
    { event: { args: true }; call: { origin: true; args: true } }
  >,
  avtHash?: string
): { from: Uint8Array; to: Uint8Array; amount: bigint; tokenId: Uint8Array } {
  const e = new BalancesDepositEvent(ctx, item.event)
  if (e.isV4) {
    const { amount, who } = e.asV4
    return {
      from: who,
      to: who,
      amount,
      tokenId: avtHash ? decodeHex(avtHash) : /* this should not be reached */ new Uint8Array()
    }
  } else {
    throw new UnknownVersionError()
  }
}

export function normalizeBalancesWithdrawEvent(
  ctx: Ctx,
  item: EventItem<
    'Balances.Withdraw',
    { event: { args: true }; call: { origin: true; args: true } }
  >,
  avtHash?: string
): { from: Uint8Array; to: Uint8Array; amount: bigint; tokenId: Uint8Array } {
  const e = new BalancesWithdrawEvent(ctx, item.event)
  if (e.isV4) {
    const { amount, who } = e.asV4
    return {
      from: who,
      to: who,
      amount,
      tokenId: avtHash ? decodeHex(avtHash) : /* this should not be reached */ new Uint8Array()
    }
  } else {
    throw new UnknownVersionError()
  }
}

export function normalizeBalancesSlashedEvent(
  ctx: Ctx,
  item: EventItem<
    'Balances.Slashed',
    { event: { args: true }; call: { origin: true; args: true } }
  >,
  avtHash?: string
): { from: Uint8Array; to: Uint8Array; amount: bigint; tokenId: Uint8Array } {
  const e = new BalancesSlashedEvent(ctx, item.event)
  if (e.isV4) {
    const { amount, who } = e.asV4
    return {
      from: who,
      to: who,
      amount,
      tokenId: avtHash ? decodeHex(avtHash) : /* this should not be reached */ new Uint8Array()
    }
  } else {
    throw new UnknownVersionError()
  }
}

export function normalizeTokenTransferEvent(
  ctx: Ctx,
  item: EventItem<
    'TokenManager.TokenTransferred',
    { event: { args: true }; call: { origin: true; args: true } }
  >
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
  item: EventItem<
    'TokenManager.TokenLifted',
    { event: { args: true }; call: { origin: true; args: true } }
  >
): {
  from: undefined
  to: Uint8Array
  amount: bigint
  tokenId: Uint8Array
} {
  const e = new TokenManagerTokenLiftedEvent(ctx, item.event)
  if (e.isV4) {
    const { tokenId, recipient, tokenBalance } = e.asV4
    return { from: undefined, to: recipient, amount: tokenBalance, tokenId }
  } else {
    throw new UnknownVersionError()
  }
}
export function normalizeTokenLoweredEvent(
  ctx: Ctx,
  item: EventItem<
    'TokenManager.TokenLowered',
    { event: { args: true }; call: { origin: true; args: true } }
  >
): {
  from: Uint8Array
  to: Uint8Array
  amount: bigint
  tokenId: Uint8Array
} {
  const e = new TokenManagerTokenLoweredEvent(ctx, item.event)
  if (e.isV4) {
    const { tokenId, recipient, sender, amount } = e.asV4
    return { from: sender, to: recipient, amount, tokenId }
  } else {
    throw new UnknownVersionError()
  }
}

export function normalizeAvtLoweredEvent(
  ctx: Ctx,
  item: EventItem<
    'TokenManager.AvtLowered',
    { event: { args: true }; call: { origin: true; args: true } }
  >,
  avtHash?: string
): {
  from: Uint8Array
  to: Uint8Array
    t1Recipient: Uint8Array
  amount: bigint
  tokenId: Uint8Array
} {
  const e = new TokenManagerAvtLoweredEvent(ctx, item.event)
  if (e.isV51) {
    const { amount, recipient, sender, t1Recipient } = e.asV51
    return {
      from: sender,
      to: recipient,
      t1Recipient,
      amount,
      tokenId: avtHash ? decodeHex(avtHash) : /* this should not be reached */ new Uint8Array()
    }
  } else {
    throw new UnknownVersionError()
  }
}

export function normalizeAvtLiftedEvent(
  ctx: Ctx,
  item: EventItem<'TokenManager.AVTLifted', { event: { args: true }; call: { origin: true } }>,
  avtHash?: string
): {
  from: undefined
  to: Uint8Array
  amount: bigint
  tokenId: Uint8Array
} {
  const e = new TokenManagerAvtLiftedEvent(ctx, item.event)
  if (e.isV4) {
    const { amount, recipient, ethTxHash } = e.asV4
    return {
      from: undefined,
      to: recipient,
      amount,
      tokenId: avtHash ? decodeHex(avtHash) : /* this should not be reached */ new Uint8Array()
    }
  } else {
    throw new UnknownVersionError()
  }
}

export function normalizeLowerRequested(
  ctx: Ctx,
  item: EventItem<'TokenManager.LowerRequested', { event: { args: true }; call: { origin: true } }>,
  avtHash?: string
): {
  from: Uint8Array
  to: undefined
    lowerId?: number
    scheduleName?: Uint8Array
    senderNonce?: bigint | undefined
    t1Recipient?: Uint8Array

  amount: bigint
  tokenId: Uint8Array
} {
  const e = new TokenManagerLowerRequestedEvent(ctx, item.event)
  if (e.isV55) {
    const { amount, from, lowerId, scheduleName, senderNonce, t1Recipient, tokenId } = e.asV55
    return {
      from,
      to: undefined,
      lowerId,
      scheduleName,
      senderNonce,
      t1Recipient,
      amount,
      tokenId
    }
  } else {
    throw new UnknownVersionError()
  }
}

export function normalizeNftBatchCreated(
  ctx: Ctx,
  item: EventItem<
    'NftManager.BatchCreated',
    { event: { args: true }; call: { origin: true; args: true } }
  >
): {
  from: undefined
  to: Uint8Array
  nftId: bigint
  totalSupply: bigint
} {
  const e = new NftManagerBatchCreatedEvent(ctx, item.event)
  if (e.isV4) {
    const { batchNftId, batchCreator, totalSupply } = e.asV4
    return { from: undefined, to: batchCreator, nftId: batchNftId, totalSupply }
  } else {
    throw new UnknownVersionError()
  }
}

export function normalizeNftSingleNftMinted(
  ctx: Ctx,
  item: EventItem<
    'NftManager.SingleNftMinted',
    { event: { args: true }; call: { origin: true; args: true } }
  >
): {
  from: undefined
  to: Uint8Array
  nftId: bigint
  totalSupply: number
} {
  const e = new NftManagerSingleNftMintedEvent(ctx, item.event)
  if (e.isV4) {
    const { nftId, owner } = e.asV4
    return { from: undefined, to: owner, nftId, totalSupply: 1 }
  } else {
    throw new UnknownVersionError()
  }
}

export function normalizeNftBatchNftMinted(
  ctx: Ctx,
  item: EventItem<
    'NftManager.BatchNftMinted',
    { event: { args: true }; call: { origin: true; args: true } }
  >
): { from: undefined; to: Uint8Array; nftId: bigint; totalSupply: number } {
  const e = new NftManagerBatchNftMintedEvent(ctx, item.event)
  if (e.isV4) {
    const { nftId, owner } = e.asV4
    return { from: undefined, to: owner, nftId, totalSupply: 1 }
  } else {
    throw new UnknownVersionError()
  }
}

export function normalizeNftFiatNftTransfer(
  ctx: Ctx,
  item: EventItem<
    'NftManager.FiatNftTransfer',
    { event: { args: true }; call: { origin: true; args: true } }
  >
): { from: Uint8Array; to: Uint8Array; nftId: bigint; totalSupply: number } {
  const e = new NftManagerFiatNftTransferEvent(ctx, item.event)
  if (e.isV4) {
    const { newOwner, nftId, sender } = e.asV4
    return { from: sender, to: newOwner, nftId, totalSupply: 1 }
  } else {
    throw new UnknownVersionError()
  }
}

export function normalizeNftEthNftTransfer(
  ctx: Ctx,
  item: EventItem<
    'NftManager.EthNftTransfer',
    { event: { args: true }; call: { origin: true; args: true } }
  >
): { from: undefined; to: Uint8Array; nftId: bigint; totalSupply: number } {
  const e = new NftManagerEthNftTransferEvent(ctx, item.event)
  if (e.isV4) {
    const { newOwner, nftId } = e.asV4
    return { from: undefined, to: newOwner, nftId, totalSupply: 1 }
  } else {
    throw new UnknownVersionError()
  }
}

class UnknownVersionError extends Error {
  constructor() {
    super('Unknown version')
  }
}

const eventNormalizers: EventNormalizers = {
  'Balances.Transfer': normalizeBalancesTransferEvent,
  'Balances.Endowed': normalizeBalancesEndowedEvent,
  'Balances.BalanceSet': normalizeBalancesBalanceSetEvent,
  'Balances.Reserved': normalizeBalancesReservedEvent,
  'Balances.Unreserved': normalizeBalancesUnreservedEvent,
  'Balances.ReserveRepatriated': normalizeBalancesReserveRepatriatedEvent,
  'Balances.Deposit': normalizeBalancesDepositEvent,
  'Balances.Withdraw': normalizeBalancesWithdrawEvent,
  'Balances.Slashed': normalizeBalancesSlashedEvent,
  'TokenManager.TokenTransferred': normalizeTokenTransferEvent,
  'TokenManager.TokenLifted': normalizeTokenLiftedEvent,
  'TokenManager.TokenLowered': normalizeTokenLoweredEvent,
  'TokenManager.AvtLowered': normalizeAvtLoweredEvent,
  'TokenManager.AVTLifted': normalizeAvtLiftedEvent,
  'TokenManager.LowerRequested': normalizeLowerRequested,
  'NftManager.BatchCreated': normalizeNftBatchCreated,
  'NftManager.SingleNftMinted': normalizeNftSingleNftMinted,
  'NftManager.BatchNftMinted': normalizeNftBatchNftMinted,
  'NftManager.FiatNftTransfer': normalizeNftFiatNftTransfer,
  'NftManager.EthNftTransfer': normalizeNftEthNftTransfer
}

export function getEvent<T extends EventName>(
  ctx: Ctx,
  item: Extract<TransfersEventItem, { name: T }>,
  avtHash?: string
): ReturnType<EventNormalizers[T]> {
  const normalizer = eventNormalizers[item.name as T]
  if (normalizer) {
    return normalizer(ctx, item, avtHash) as ReturnType<EventNormalizers[T]>
  }
  throw new Error()
}
export async function getBalances(
  ctx: Ctx,
  block: Block,
  accounts: Uint8Array[]
): Promise<BalanceType[] | undefined> {
  ctx.log.child('state').info(`getting accounts balance`)
  return (
    (await getSystemAccountBalances(ctx, block, accounts)) ??
    (await getBalancesAccountBalances(ctx, block, accounts))
  )
}

export async function getBalancesAccountBalances(
  ctx: Ctx,
  block: Block,
  accounts: Uint8Array[]
): Promise<BalanceType[] | undefined> {
  const storage = new BalancesAccountStorage(ctx, block)
  if (!storage.isExists) return undefined

  const data = await storage.asV4.getMany(accounts.filter(Boolean))

  return data.map((d: BalanceType) => ({ free: d.free, reserved: d.reserved }))
}

export async function getSystemAccountBalances(
  ctx: Ctx,
  block: Block,
  accounts: Uint8Array[]
): Promise<BalanceType[] | undefined> {
  const storage = new SystemAccountStorage(ctx, block)
  if (!storage.isExists) return undefined
  const data = (await storage.asV4.getMany(
    accounts.filter(Boolean).filter(account => account.length)
  )) as AccountInfo[]

  return data.map(d => ({
    free: d.data.free,
    reserved: d.data.reserved
  }))
}
