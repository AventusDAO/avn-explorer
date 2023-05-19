import { toHex } from '@subsquid/substrate-processor'
import { UnknownVersionError } from '@avn/types'
import {
  BalancesBalanceSetEvent,
  BalancesDepositEvent,
  BalancesEndowedEvent,
  BalancesReservedEvent,
  BalancesReserveRepatriatedEvent,
  BalancesSlashedEvent,
  BalancesTransferEvent,
  BalancesUnreservedEvent,
  BalancesWithdrawEvent,
  MigrationMigratedSystemAccountsEvent,
  MigrationMigratedTotalIssuanceEvent
} from '../types/generated/parachain-dev/events'
import { BalancesTotalIssuanceStorage } from '../types/generated/parachain-dev/storage'
import { Block, ChainContext, Event } from '../types/generated/parachain-dev/support'

export function getAccountFromBalanceSetEvent(ctx: ChainContext, event: Event): string {
  const data = new BalancesBalanceSetEvent(ctx, event)

  if (data.isV21) {
    return toHex(data.asV21.who)
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export function getAccountsFromTransferEvent(ctx: ChainContext, event: Event): string[] {
  const data = new BalancesTransferEvent(ctx, event)
  // ctx._chain.getStorage // what was it?
  if (data.isV21) {
    return [toHex(data.asV21.from), toHex(data.asV21.to)]
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export function getAccountFromEndowedEvent(ctx: ChainContext, event: Event): string {
  const data = new BalancesEndowedEvent(ctx, event)

  if (data.isV21) {
    return toHex(data.asV21.account)
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export function getAccountFromDepositEvent(ctx: ChainContext, event: Event): string {
  const data = new BalancesDepositEvent(ctx, event)

  if (data.isV21) {
    return toHex(data.asV21.who)
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export function getAccountFromReservedEvent(ctx: ChainContext, event: Event): string {
  const data = new BalancesReservedEvent(ctx, event)

  if (data.isV21) {
    return toHex(data.asV21.who)
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export function getAccountFromUnreservedEvent(ctx: ChainContext, event: Event): string {
  const data = new BalancesUnreservedEvent(ctx, event)

  if (data.isV21) {
    return toHex(data.asV21.who)
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export function getAccountFromWithdrawEvent(ctx: ChainContext, event: Event): string {
  const data = new BalancesWithdrawEvent(ctx, event)

  if (data.isV21) {
    return toHex(data.asV21.who)
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export function getAccountFromSlashedEvent(ctx: ChainContext, event: Event): string {
  const data = new BalancesSlashedEvent(ctx, event)

  if (data.isV21) {
    return toHex(data.asV21.who)
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export function getAccountsReserveRepatriatedEvent(ctx: ChainContext, event: Event): string[] {
  const data = new BalancesReserveRepatriatedEvent(ctx, event)

  if (data.isV21) {
    return [toHex(data.asV21.from), toHex(data.asV21.to)]
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export async function getTotalIssuance(
  ctx: ChainContext,
  block: Block
): Promise<bigint | undefined> {
  const storage = new BalancesTotalIssuanceStorage(ctx, block)
  if (!storage.isExists) return undefined

  if (storage.isV21) {
    return await storage.getAsV21()
  }

  throw new UnknownVersionError(storage.constructor.name)
}

export function getMigratedSystemAccounts(ctx: ChainContext, event: Event): number {
  const data = new MigrationMigratedSystemAccountsEvent(ctx, event)
  if (data.isV21) {
    return data.asV21
  }
  throw new UnknownVersionError(data.constructor.name)
}

export async function getMigratedTotalIssuance(ctx: ChainContext, event: Event): Promise<bigint[]> {
  const data = new MigrationMigratedTotalIssuanceEvent(ctx, event)

  if (data.isV21) {
    return [...data.asV21]
  }
  throw new UnknownVersionError(data.constructor.name)
}
