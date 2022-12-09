import { toHex } from '@subsquid/substrate-processor'
import { UnknownVersionError } from '../processor'
import {
  BalancesBalanceSetEvent,
  BalancesDepositEvent,
  BalancesEndowedEvent,
  BalancesReservedEvent,
  BalancesReserveRepatriatedEvent,
  BalancesSlashedEvent,
  BalancesTransferEvent,
  BalancesUnreservedEvent,
  BalancesWithdrawEvent
} from '../types/generated/parachain-dev/events'
import { BalancesTotalIssuanceStorage } from '../types/generated/parachain-dev/storage'
import { Block, ChainContext, Event } from '../types/generated/parachain-dev/support'

export function getBalanceSetAccount(ctx: ChainContext, event: Event) {
  const data = new BalancesBalanceSetEvent(ctx, event)

  if (data.isV10) {
    return toHex(data.asV10.who)
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export function getTransferAccounts(ctx: ChainContext, event: Event) {
  const data = new BalancesTransferEvent(ctx, event)
  ctx._chain.getStorage
  if (data.isV10) {
    return [toHex(data.asV10.from), toHex(data.asV10.to)]
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export function getEndowedAccount(ctx: ChainContext, event: Event) {
  const data = new BalancesEndowedEvent(ctx, event)

  if (data.isV10) {
    return toHex(data.asV10.account)
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export function getDepositAccount(ctx: ChainContext, event: Event) {
  const data = new BalancesDepositEvent(ctx, event)

  if (data.isV10) {
    return toHex(data.asV10.who)
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export function getReservedAccount(ctx: ChainContext, event: Event) {
  const data = new BalancesReservedEvent(ctx, event)

  if (data.isV10) {
    return toHex(data.asV10.who)
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export function getUnreservedAccount(ctx: ChainContext, event: Event) {
  const data = new BalancesUnreservedEvent(ctx, event)

  if (data.isV10) {
    return toHex(data.asV10.who)
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export function getWithdrawAccount(ctx: ChainContext, event: Event) {
  const data = new BalancesWithdrawEvent(ctx, event)

  if (data.isV10) {
    return toHex(data.asV10.who)
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export function getSlashedAccount(ctx: ChainContext, event: Event) {
  const data = new BalancesSlashedEvent(ctx, event)

  if (data.isV10) {
    return toHex(data.asV10.who)
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export function getReserveRepatriatedAccounts(ctx: ChainContext, event: Event) {
  const data = new BalancesReserveRepatriatedEvent(ctx, event)

  if (data.isV10) {
    return [toHex(data.asV10.from), toHex(data.asV10.to)]
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export async function getTotalIssuance(ctx: ChainContext, block: Block) {
  const storage = new BalancesTotalIssuanceStorage(ctx, block)
  if (!storage.isExists) return undefined

  if (storage.isV10) {
    return await storage.getAsV10()
  }

  throw new UnknownVersionError(storage.constructor.name)
}
