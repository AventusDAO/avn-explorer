import { ChainContext, Event } from '../types/generated/parachain-dev/support'
import {
  TokenManagerTokenLiftedEvent,
  TokenManagerTokenLoweredEvent,
  TokenManagerTokenTransferredEvent
} from '../types/generated/parachain-dev/events'
import { TokenManagerTokenLoweredEvent as TestnetTokenManagerTokenLoweredEvent } from '../types/generated/parachain-testnet/events'
import { TokenManagerTokenLoweredEvent as MainnetTokenManagerTokenLoweredEvent } from '../types/generated/parachain-mainnet/events'
import { UnknownVersionError } from '@avn/types'

export const getTokenLoweredEventVersion = () => {
  console.log("HELP !!!", process.env.ENV)
  switch (process.env.ENV) {
    case 'dev':
      return TokenManagerTokenLoweredEvent
    case 'testnet':
      return TestnetTokenManagerTokenLoweredEvent
    case 'mainnet':
      return MainnetTokenManagerTokenLoweredEvent
    default:
      return TokenManagerTokenLoweredEvent
  }
}

export const getTokenLowerData = (ctx: ChainContext, event: Event): RawTokenBalanceData => {
  const TokenLoweredEventClass = getTokenLoweredEventVersion()
  const data = new TokenLoweredEventClass(ctx, event)

  if ('isV58' in data && data.isV58) {
    const v10Data = data.asV58
    return {
      tokenId: v10Data.tokenId,
      accountId: v10Data.recipient,
      amount: v10Data.amount
    }
  } else if ('isV70' in data && data.isV70) {
    const v10Data = data.asV70
    return {
      tokenId: v10Data.tokenId,
      accountId: v10Data.recipient,
      amount: v10Data.amount
    }
  } else if ('isV57' in data && data.isV57) {
    const v10Data = data.asV57
    return {
      tokenId: v10Data.tokenId,
      accountId: v10Data.recipient,
      amount: v10Data.amount
    }
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export const getTokenTransferredData = (ctx: ChainContext, event: Event): RawTokenBalanceData => {
  const data = new TokenManagerTokenTransferredEvent(ctx, event)

  if (data.isV58) {
    const v10Data = data.asV58
    return {
      tokenId: v10Data.tokenId,
      accountId: v10Data.recipient,
      amount: v10Data.tokenBalance
    }
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export const getTokenLiftedData = (ctx: ChainContext, event: Event): RawTokenBalanceData => {
  const data = new TokenManagerTokenLiftedEvent(ctx, event)

  if (data.isV58) {
    const v10Data = data.asV58
    return {
      tokenId: v10Data.tokenId,
      accountId: v10Data.recipient,
      amount: v10Data.tokenBalance
    }
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export type RawTokenBalanceData = { tokenId: Uint8Array; accountId: Uint8Array; amount: bigint }
