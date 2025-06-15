import { UnknownVersionError } from '@avn/types'
import { ChainContext, Event } from '../types/generated/truth-testnet/support'
import type { Asset as v3Asset } from '../types/generated/truth-testnet/v3'
import { u8aToString, u8aToHex } from '@polkadot/util'

import * as TruthEvents from '../types/generated/truth-testnet/events'
import { Asset } from '../model'



export const TRUTH_MODE: boolean = process.env.TRUTH_MODE === 'true'

export type ExtractedData = {account: Uint8Array, currency: v3Asset }

export function getDataFromAssetRegisteredEvent(ctx: ChainContext, event: Event): Asset | undefined {
  const data = new TruthEvents.AssetRegistryRegisteredAssetEvent(ctx, event)

  if ('isV3' in data && data.isV3) {
    if (data.asV3.assetId.__kind === "ForeignAsset") {
        const metadata = data.asV3.metadata;
        return new Asset( {
            id: `ForeignAsset-${data.asV3.assetId.value}`,
            symbol: u8aToString(metadata?.symbol),
            ethAddress: u8aToHex(metadata?.additional?.ethAddress),
            name: u8aToString(metadata?.name),
            decimals: metadata?.decimals,
            baseAsset: metadata?.additional?.allowAsBaseAsset ?? false,
            holders: []
        })
    }
    return undefined
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export function getDataFromAssetUpdatedEvent(ctx: ChainContext, event: Event): Pick<Asset, "id" | "symbol" | "ethAddress"| "name"| "decimals" | "baseAsset"> | undefined {
  const data = new TruthEvents.AssetRegistryUpdatedAssetEvent(ctx, event)

  if ('isV3' in data && data.isV3) {
    if (data.asV3.assetId.__kind === "ForeignAsset") {
        const metadata = data.asV3.metadata;
        return new Asset({
            id: `ForeignAsset-${data.asV3.assetId.value}`,
            symbol: u8aToString(metadata?.symbol),
            ethAddress: u8aToHex(metadata?.additional?.ethAddress),
            name: u8aToString(metadata?.name),
            decimals: metadata?.decimals,
            baseAsset: metadata?.additional?.allowAsBaseAsset ?? false,
        })
    }
    return undefined
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export function getAccountFromEndowedEvent(ctx: ChainContext, event: Event): ExtractedData | undefined {
  const data = new TruthEvents.TokensEndowedEvent(ctx, event)

  if ('isV3' in data && data.isV3) {
    if (data.asV3.currencyId.__kind === "ForeignAsset") {
        return {account: data.asV3.who, currency: data.asV3.currencyId}
    }
    return undefined
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export function getAccountFromDustLostEvent(ctx: ChainContext, event: Event): ExtractedData | undefined {
  const data = new TruthEvents.TokensDustLostEvent(ctx, event)

  if ('isV3' in data && data.isV3) {
    if (data.asV3.currencyId.__kind === "ForeignAsset") {
        return {account: data.asV3.who, currency: data.asV3.currencyId}
    }
    return undefined
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export function getAccountsFromTransferEvent(ctx: ChainContext, event: Event): ExtractedData[] | undefined {
  const data = new TruthEvents.TokensTransferEvent(ctx, event)

  if ('isV3' in data && data.isV3) {
    if (data.asV3.currencyId.__kind === "ForeignAsset") {
        return [
            {account: data.asV3.from, currency: data.asV3.currencyId},
            {account: data.asV3.to, currency: data.asV3.currencyId}
        ]
    }
    return undefined
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export function getAccountFromReservedEvent(ctx: ChainContext, event: Event): ExtractedData | undefined {
  const data = new TruthEvents.TokensReservedEvent(ctx, event)

  if ('isV3' in data && data.isV3) {
    if (data.asV3.currencyId.__kind === "ForeignAsset") {
        return {account: data.asV3.who, currency: data.asV3.currencyId}
    }
    return undefined
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export function getAccountFromUnreservedEvent(ctx: ChainContext, event: Event): ExtractedData | undefined {
  const data = new TruthEvents.TokensUnreservedEvent(ctx, event)

  if ('isV3' in data && data.isV3) {
    if (data.asV3.currencyId.__kind === "ForeignAsset") {
        return {account: data.asV3.who, currency: data.asV3.currencyId}
    }
    return undefined
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export function getAccountsFromReserveRepatriatedEvent(ctx: ChainContext, event: Event): ExtractedData[] | undefined {

  const data = new TruthEvents.TokensReserveRepatriatedEvent(ctx, event)

  if ('isV3' in data && data.isV3) {
    if (data.asV3.currencyId.__kind === "ForeignAsset") {
        return [
            {account: data.asV3.from, currency: data.asV3.currencyId},
            {account: data.asV3.to, currency: data.asV3.currencyId}
        ]
    }
    return undefined
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export function getAccountFromBalanceSetEvent(ctx: ChainContext, event: Event): ExtractedData | undefined {

  const data = new TruthEvents.TokensBalanceSetEvent(ctx, event)

  if ('isV3' in data && data.isV3) {
    if (data.asV3.currencyId.__kind === "ForeignAsset") {
        return {account: data.asV3.who, currency: data.asV3.currencyId}
    }
    return undefined
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export function getAccountFromWithdrawnEvent(ctx: ChainContext, event: Event): ExtractedData | undefined {

  const data = new TruthEvents.TokensWithdrawnEvent(ctx, event)

  if ('isV3' in data && data.isV3) {
    if (data.asV3.currencyId.__kind === "ForeignAsset") {
        return {account: data.asV3.who, currency: data.asV3.currencyId}
    }
    return undefined
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export function getAccountFromSlashedEvent(ctx: ChainContext, event: Event): ExtractedData | undefined {

  const data = new TruthEvents.TokensSlashedEvent(ctx, event)

  if ('isV3' in data && data.isV3) {
    if (data.asV3.currencyId.__kind === "ForeignAsset") {
        return {account: data.asV3.who, currency: data.asV3.currencyId}
    }
    return undefined
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export function getAccountFromDepositedEvent(ctx: ChainContext, event: Event): ExtractedData | undefined {

  const data = new TruthEvents.TokensDepositedEvent(ctx, event)

  if ('isV3' in data && data.isV3) {
    if (data.asV3.currencyId.__kind === "ForeignAsset") {
        return {account: data.asV3.who, currency: data.asV3.currencyId}
    }
    return undefined
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export function getAccountFromLockSetEvent(ctx: ChainContext, event: Event): ExtractedData | undefined {

  const data = new TruthEvents.TokensLockSetEvent(ctx, event)

  if ('isV3' in data && data.isV3) {
    if (data.asV3.currencyId.__kind === "ForeignAsset") {
        return {account: data.asV3.who, currency: data.asV3.currencyId}
    }
    return undefined
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export function getAccountFromLockRemovedEvent(ctx: ChainContext, event: Event): ExtractedData | undefined {

  const data = new TruthEvents.TokensLockRemovedEvent(ctx, event)

  if ('isV3' in data && data.isV3) {
    if (data.asV3.currencyId.__kind === "ForeignAsset") {
        return {account: data.asV3.who, currency: data.asV3.currencyId}
    }
    return undefined
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export function getAccountFromLockedEvent(ctx: ChainContext, event: Event): ExtractedData | undefined {

  const data = new TruthEvents.TokensLockedEvent(ctx, event)

  if ('isV3' in data && data.isV3) {
    if (data.asV3.currencyId.__kind === "ForeignAsset") {
        return {account: data.asV3.who, currency: data.asV3.currencyId}
    }
    return undefined
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export function getAccountFromUnlockedEvent(ctx: ChainContext, event: Event): ExtractedData | undefined {

  const data = new TruthEvents.TokensUnlockedEvent(ctx, event)

  if ('isV3' in data && data.isV3) {
    if (data.asV3.currencyId.__kind === "ForeignAsset") {
        return {account: data.asV3.who, currency: data.asV3.currencyId}
    }
    return undefined
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}