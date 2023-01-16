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

export function getBalanceSetAccount(ctx: ChainContext, event: Event) {
  const data = new BalancesBalanceSetEvent(ctx, event)

  if (data.isV4) {
    return toHex(data.asV4.who)
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export function getTransferAccounts(ctx: ChainContext, event: Event) {
  const data = new BalancesTransferEvent(ctx, event)
  // ctx._chain.getStorage // what was it?
  if (data.isV4) {
    return [toHex(data.asV4.from), toHex(data.asV4.to)]
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export function getEndowedAccount(ctx: ChainContext, event: Event) {
  const data = new BalancesEndowedEvent(ctx, event)

  if (data.isV4) {
    return toHex(data.asV4.account)
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export function getDepositAccount(ctx: ChainContext, event: Event) {
  const data = new BalancesDepositEvent(ctx, event)

  if (data.isV4) {
    return toHex(data.asV4.who)
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export function getReservedAccount(ctx: ChainContext, event: Event) {
  const data = new BalancesReservedEvent(ctx, event)

  if (data.isV4) {
    return toHex(data.asV4.who)
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export function getUnreservedAccount(ctx: ChainContext, event: Event) {
  const data = new BalancesUnreservedEvent(ctx, event)

  if (data.isV4) {
    return toHex(data.asV4.who)
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export function getWithdrawAccount(ctx: ChainContext, event: Event) {
  const data = new BalancesWithdrawEvent(ctx, event)

  if (data.isV4) {
    return toHex(data.asV4.who)
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export function getSlashedAccount(ctx: ChainContext, event: Event) {
  const data = new BalancesSlashedEvent(ctx, event)

  if (data.isV4) {
    return toHex(data.asV4.who)
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export function getReserveRepatriatedAccounts(ctx: ChainContext, event: Event) {
  const data = new BalancesReserveRepatriatedEvent(ctx, event)

  if (data.isV4) {
    return [toHex(data.asV4.from), toHex(data.asV4.to)]
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export async function getTotalIssuance(ctx: ChainContext, block: Block) {
  const storage = new BalancesTotalIssuanceStorage(ctx, block)
  if (!storage.isExists) return undefined

  if (storage.isV4) {
    return await storage.getAsV4()
  }

  throw new UnknownVersionError(storage.constructor.name)
}

export function getMigratedSystemAccounts(ctx: ChainContext, event: Event) {
  const data = new MigrationMigratedSystemAccountsEvent(ctx, event)
  if (data.isV4) {
    ctx._chain.queryStorage
    return data.asV4
  }
  throw new UnknownVersionError(data.constructor.name)
}

export async function getMigratedTotalIssuance(ctx: ChainContext, event: Event) {
  const data = new MigrationMigratedTotalIssuanceEvent(ctx, event)

  if (data.isV4) {
    return [...data.asV4]
  }
  throw new UnknownVersionError(data.constructor.name)
}
