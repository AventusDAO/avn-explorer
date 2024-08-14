import { toHex } from '@subsquid/substrate-processor'
import { UnknownVersionError } from '@avn/types'

import * as ParachainStorage from '../types/generated/parachain-testnet/storage'
import * as VowStorage from '../types/generated/vow-testnet/storage'
import { Block, ChainContext, Event } from '../types/generated/parachain-testnet/support'

import * as ParachainEvents from '../types/generated/parachain-testnet/events'
import * as VowEvents from '../types/generated/vow-testnet/events'

type VowMode = boolean

const VOW_MODE: VowMode = process.env.VOW_MODE === 'true'

export function getAccountFromBalanceSetEvent(ctx: ChainContext, event: Event): string {
  const EventClass = VOW_MODE
    ? VowEvents.BalancesBalanceSetEvent
    : ParachainEvents.BalancesBalanceSetEvent

  const data = new EventClass(ctx, event)

  if ('isNodeTemplateV100' in data && data.isNodeTemplateV100) {
    return toHex(data.asNodeTemplateV100.who)
  } else if ('isV4' in data && data.isV4) {
    return toHex(data.asV4.who)
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export function getAccountsFromTransferEvent(ctx: ChainContext, event: Event): string[] {
  const EventClass = VOW_MODE
    ? VowEvents.BalancesTransferEvent
    : ParachainEvents.BalancesTransferEvent

  const data = new EventClass(ctx, event)

  if ('isNodeTemplateV100' in data && data.isNodeTemplateV100) {
    return [toHex(data.asNodeTemplateV100.from), toHex(data.asNodeTemplateV100.to)]
  } else if ('isV4' in data && data.isV4) {
    return [toHex(data.asV4.from), toHex(data.asV4.to)]
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export function getAccountFromEndowedEvent(ctx: ChainContext, event: Event): string {
  const EventClass = VOW_MODE
    ? VowEvents.BalancesEndowedEvent
    : ParachainEvents.BalancesEndowedEvent

  const data = new EventClass(ctx, event)

  if ('isNodeTemplateV100' in data && data.isNodeTemplateV100) {
    return toHex(data.asNodeTemplateV100.account)
  } else if ('isV4' in data && data.isV4) {
    return toHex(data.asV4.account)
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export function getAccountFromDepositEvent(ctx: ChainContext, event: Event): string {
  const EventClass = VOW_MODE
    ? VowEvents.BalancesDepositEvent
    : ParachainEvents.BalancesDepositEvent

  const data = new EventClass(ctx, event)

  if ('isNodeTemplateV100' in data && data.isNodeTemplateV100) {
    return toHex(data.asNodeTemplateV100.who)
  } else if ('isV4' in data && data.isV4) {
    return toHex(data.asV4.who)
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export function getAccountFromReservedEvent(ctx: ChainContext, event: Event): string {
  // const events = getEventsModule()
  // const data = new events.BalancesReservedEvent(ctx, event)

  const EventClass = VOW_MODE
    ? VowEvents.BalancesReservedEvent
    : ParachainEvents.BalancesReservedEvent

  const data = new EventClass(ctx, event)

  if ('isNodeTemplateV100' in data && data.isNodeTemplateV100) {
    return toHex(data.asNodeTemplateV100.who)
  } else if ('isV4' in data && data.isV4) {
    return toHex(data.asV4.who)
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export function getAccountFromUnreservedEvent(ctx: ChainContext, event: Event): string {
  const EventClass = VOW_MODE
    ? VowEvents.BalancesUnreservedEvent
    : ParachainEvents.BalancesUnreservedEvent

  const data = new EventClass(ctx, event)

  if ('isNodeTemplateV100' in data && data.isNodeTemplateV100) {
    return toHex(data.asNodeTemplateV100.who)
  } else if ('isV4' in data && data.isV4) {
    return toHex(data.asV4.who)
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export function getAccountFromWithdrawEvent(ctx: ChainContext, event: Event): string {
  const EventClass = VOW_MODE
    ? VowEvents.BalancesWithdrawEvent
    : ParachainEvents.BalancesWithdrawEvent

  const data = new EventClass(ctx, event)

  if ('isNodeTemplateV100' in data && data.isNodeTemplateV100) {
    return toHex(data.asNodeTemplateV100.who)
  } else if ('isV4' in data && data.isV4) {
    return toHex(data.asV4.who)
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export function getAccountFromSlashedEvent(ctx: ChainContext, event: Event): string {
  const EventClass = VOW_MODE
    ? VowEvents.BalancesSlashedEvent
    : ParachainEvents.BalancesSlashedEvent

  const data = new EventClass(ctx, event)

  if ('isNodeTemplateV100' in data && data.isNodeTemplateV100) {
    return toHex(data.asNodeTemplateV100.who)
  } else if ('isV4' in data && data.isV4) {
    return toHex(data.asV4.who)
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export function getAccountsReserveRepatriatedEvent(ctx: ChainContext, event: Event): string[] {
  const EventClass = VOW_MODE
    ? VowEvents.BalancesReserveRepatriatedEvent
    : ParachainEvents.BalancesReserveRepatriatedEvent

  const data = new EventClass(ctx, event)

  if ('isNodeTemplateV100' in data && data.isNodeTemplateV100) {
    return [toHex(data.asNodeTemplateV100.from), toHex(data.asNodeTemplateV100.to)]
  } else if ('isV4' in data && data.isV4) {
    return [toHex(data.asV4.from), toHex(data.asV4.to)]
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export async function getTotalIssuance(
  ctx: ChainContext,
  block: Block
): Promise<bigint | undefined> {
  const EventClass = VOW_MODE
    ? VowStorage.BalancesTotalIssuanceStorage
    : ParachainStorage.BalancesTotalIssuanceStorage
  const data = new EventClass(ctx, block)
  if (!data.isExists) return undefined
  if ('isNodeTemplateV100' in data && data.isNodeTemplateV100) {
    return await data.asNodeTemplateV100.get()
  } else if ('isV4' in data && data.isV4) {
    return await data.asV4.get()
  }

  throw new UnknownVersionError(data.constructor.name)
}

export function getMigratedSystemAccounts(ctx: ChainContext, event: Event): number {
  const data = new ParachainEvents.MigrationMigratedSystemAccountsEvent(ctx, event)
  if (data.isV4) {
    return data.asV4
  }
  throw new UnknownVersionError(data.constructor.name)
}

export async function getMigratedTotalIssuance(ctx: ChainContext, event: Event): Promise<bigint[]> {
  const data = new ParachainEvents.MigrationMigratedTotalIssuanceEvent(ctx, event)

  if (data.isV4) {
    return [...data.asV4]
  }
  throw new UnknownVersionError(data.constructor.name)
}
