import { toHex } from '@subsquid/substrate-processor'
import { UnknownVersionError } from '@avn/types'

import * as ParachainStorage from '../types/generated/parachain-testnet/storage'
import * as VowStorage from '../types/generated/vow-testnet/storage'
import * as EwStorage from '../types/generated/ew-testnet/storage'
import * as TruthStorage from '../types/generated/truth-dev/storage'

import { Block, ChainContext, Event } from '../types/generated/parachain-testnet/support'

import * as ParachainEvents from '../types/generated/parachain-testnet/events'
import * as VowEvents from '../types/generated/vow-testnet/events'
import * as EwEvents from '../types/generated/ew-testnet/events'
import * as TruthEvents from '../types/generated/truth-dev/events'

type VowMode = boolean
type EwMode = boolean

export const VOW_MODE: VowMode = process.env.VOW_MODE === 'true'
export const EW_MODE: EwMode = process.env.EW_MODE === 'true'
export const TRUTH_MODE: VowMode = process.env.TRUTH_MODE === 'true'

export function getStorageClass(): typeof VowStorage | typeof EwStorage | typeof ParachainStorage | typeof TruthStorage {
  if (VOW_MODE) {
    return VowStorage
  } else if (EW_MODE) {
    return EwStorage
  } else if (TRUTH_MODE) {
    return TruthStorage
  } else {
    return ParachainStorage
  }
}

export function getEventClass(): typeof VowEvents | typeof EwEvents | typeof ParachainEvents | typeof TruthEvents {
  if (VOW_MODE) {
    return VowEvents
  } else if (EW_MODE) {
    return EwEvents
  } else if (TRUTH_MODE) {
    return TruthEvents
  } else {
    return ParachainEvents
  }
}

export function getAccountFromBalanceSetEvent(ctx: ChainContext, event: Event): string {
  const EventClass = getEventClass()

  const data = new EventClass.BalancesBalanceSetEvent(ctx, event)

  if ('isNodeTemplateV100' in data && data.isNodeTemplateV100) {
    return toHex(data.asNodeTemplateV100.who)
  } else if ('isV4' in data && data.isV4) {
    return toHex(data.asV4.who)
  } else if ('isV73' in data && data.isV73) {
    return toHex(data.asV73.who)
  } else if ('isV3' in data && data.isV3) {
    return toHex(data.asV3.who)
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export function getAccountsFromTransferEvent(ctx: ChainContext, event: Event): string[] {
  const EventClass = getEventClass()

  const data = new EventClass.BalancesTransferEvent(ctx, event)

  if ('isNodeTemplateV100' in data && data.isNodeTemplateV100) {
    return [toHex(data.asNodeTemplateV100.from), toHex(data.asNodeTemplateV100.to)]
  } else if ('isV4' in data && data.isV4) {
    return [toHex(data.asV4.from), toHex(data.asV4.to)]
  } else if ('isV73' in data && data.isV73) {
    return [toHex(data.asV73.from), toHex(data.asV73.to)]
  } else if ('isV3' in data && data.isV3) {
    return [toHex(data.asV3.from), toHex(data.asV3.to)]
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export function getAccountFromEndowedEvent(ctx: ChainContext, event: Event): string {
  const EventClass = getEventClass()

  const data = new EventClass.BalancesEndowedEvent(ctx, event)

  if ('isNodeTemplateV100' in data && data.isNodeTemplateV100) {
    return toHex(data.asNodeTemplateV100.account)
  } else if ('isV4' in data && data.isV4) {
    return toHex(data.asV4.account)
  } else if ('isV73' in data && data.isV73) {
    return toHex(data.asV73.account)
  } else if ('isV3' in data && data.isV3) {
    return toHex(data.asV3.account)
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export function getAccountFromDepositEvent(ctx: ChainContext, event: Event): string {
  const EventClass = getEventClass()

  const data = new EventClass.BalancesDepositEvent(ctx, event)

  if ('isNodeTemplateV100' in data && data.isNodeTemplateV100) {
    return toHex(data.asNodeTemplateV100.who)
  } else if ('isV4' in data && data.isV4) {
    return toHex(data.asV4.who)
  } else if ('isV73' in data && data.isV73) {
    return toHex(data.asV73.who)
  } else if ('isV3' in data && data.isV3) {
    return toHex(data.asV3.who)
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export function getAccountFromReservedEvent(ctx: ChainContext, event: Event): string {
  const EventClass = getEventClass()

  const data = new EventClass.BalancesReservedEvent(ctx, event)

  if ('isNodeTemplateV100' in data && data.isNodeTemplateV100) {
    return toHex(data.asNodeTemplateV100.who)
  } else if ('isV4' in data && data.isV4) {
    return toHex(data.asV4.who)
  } else if ('isV73' in data && data.isV73) {
    return toHex(data.asV73.who)
  } else if ('isV3' in data && data.isV3) {
    return toHex(data.asV3.who)
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export function getAccountFromUnreservedEvent(ctx: ChainContext, event: Event): string {
  const EventClass = getEventClass()

  const data = new EventClass.BalancesUnreservedEvent(ctx, event)

  if ('isNodeTemplateV100' in data && data.isNodeTemplateV100) {
    return toHex(data.asNodeTemplateV100.who)
  } else if ('isV4' in data && data.isV4) {
    return toHex(data.asV4.who)
  } else if ('isV73' in data && data.isV73) {
    return toHex(data.asV73.who)
  } else if ('isV3' in data && data.isV3) {
    return toHex(data.asV3.who)
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export function getAccountFromWithdrawEvent(ctx: ChainContext, event: Event): string {
  const EventClass = getEventClass()

  const data = new EventClass.BalancesWithdrawEvent(ctx, event)

  if ('isNodeTemplateV100' in data && data.isNodeTemplateV100) {
    return toHex(data.asNodeTemplateV100.who)
  } else if ('isV4' in data && data.isV4) {
    return toHex(data.asV4.who)
  } else if ('isV73' in data && data.isV73) {
    return toHex(data.asV73.who)
  } else if ('isV3' in data && data.isV3) {
    return toHex(data.asV3.who)
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export function getAccountFromSlashedEvent(ctx: ChainContext, event: Event): string {
  const EventClass = getEventClass()

  const data = new EventClass.BalancesSlashedEvent(ctx, event)

  if ('isNodeTemplateV100' in data && data.isNodeTemplateV100) {
    return toHex(data.asNodeTemplateV100.who)
  } else if ('isV4' in data && data.isV4) {
    return toHex(data.asV4.who)
  } else if ('isV73' in data && data.isV73) {
    return toHex(data.asV73.who)
  } else if ('isV3' in data && data.isV3) {
    return toHex(data.asV3.who)
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export function getAccountsReserveRepatriatedEvent(ctx: ChainContext, event: Event): string[] {
  const EventClass = getEventClass()

  const data = new EventClass.BalancesReserveRepatriatedEvent(ctx, event)

  if ('isNodeTemplateV100' in data && data.isNodeTemplateV100) {
    return [toHex(data.asNodeTemplateV100.from), toHex(data.asNodeTemplateV100.to)]
  } else if ('isV4' in data && data.isV4) {
    return [toHex(data.asV4.from), toHex(data.asV4.to)]
  } else if ('isV73' in data && data.isV73) {
    return [toHex(data.asV73.from), toHex(data.asV73.to)]
  } else if ('isV3' in data && data.isV3) {
    return [toHex(data.asV3.from), toHex(data.asV3.to)]
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export async function getTotalIssuance(
  ctx: ChainContext,
  block: Block
): Promise<bigint | undefined> {
  const StorageClass = getStorageClass()
  const data = new StorageClass.BalancesTotalIssuanceStorage(ctx, block)
  if (!data.isExists) return undefined
  if ('isNodeTemplateV100' in data && data.isNodeTemplateV100) {
    return await data.asNodeTemplateV100.get()
  } else if ('isV4' in data && data.isV4) {
    return await data.asV4.get()
  } else if ('isV73' in data && data.isV73) {
    return await data.asV73.get()
  } else if ('isV3' in data && data.isV3) {
    return await data.asV3.get()
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
