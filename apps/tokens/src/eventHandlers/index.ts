import { ChainContext, Event } from '../types/generated/parachain-dev/support'
import {
  TokenManagerTokenLiftedEvent,
  TokenManagerTokenLoweredEvent,
  TokenManagerTokenTransferredEvent
} from '../types/generated/parachain-dev/events'
import { UnknownVersionError } from '@avn/types'

export const getTokenLowerData = (ctx: ChainContext, event: Event): RawTokenBalanceData => {
  const data = new TokenManagerTokenLoweredEvent(ctx, event)

  if (data.isV58) {
    const v10Data = data.asV58
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
