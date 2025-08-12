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

  // Handle dev environment (V58)
  if ('isV58' in data && data.isV58) {
    const v58Data = data.asV58
    return {
      tokenId: v58Data.tokenId,
      accountId: v58Data.recipient,
      amount: v58Data.amount
    }
  } 
  // Handle testnet environment (V70)
  else if ('isV70' in data && data.isV70) {
    const v70Data = data.asV70
    return {
      tokenId: v70Data.tokenId,
      accountId: v70Data.recipient,
      amount: v70Data.amount
    }
  } 
  // Handle mainnet environment (V57)
  else if ('isV57' in data && data.isV57) {
    const v57Data = data.asV57
    return {
      tokenId: v57Data.tokenId,
      accountId: v57Data.recipient,
      amount: v57Data.amount
    }
  }
  // Handle mainnet environment (V4)
  else if ('isV4' in data && data.isV4) {
    const v4Data = data.asV4
    return {
      tokenId: v4Data.tokenId,
      accountId: v4Data.recipient,
      amount: v4Data.amount
    }
  } 
  else {
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
