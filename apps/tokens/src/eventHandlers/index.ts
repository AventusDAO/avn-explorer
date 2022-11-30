import { ChainContext, Event } from '../types/generated/parachain-dev/support'
import {
  TokenManagerTokenLiftedEvent,
  TokenManagerTokenLoweredEvent,
  TokenManagerTokenTransferredEvent
} from '../types/generated/parachain-dev/events'
import { toHex } from '@subsquid/substrate-processor'
import { UnknownVersionError } from '../processor'

type AccountData = Uint8Array[]

type ReturnedData = {
  tokenId: Uint8Array
  accounts?: AccountData
}

export const getTokenLowerData = (ctx: ChainContext, event: Event): ReturnedData => {
  const data = new TokenManagerTokenLoweredEvent(ctx, event)

  if (data.isV10) {
    const v10Data = data.asV10
    return {
      tokenId: v10Data.tokenId,
      accounts: [v10Data.sender, v10Data.recipient]
    }
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export const getTokenTransferredData = (ctx: ChainContext, event: Event): ReturnedData => {
  const data = new TokenManagerTokenTransferredEvent(ctx, event)

  if (data.isV10) {
    const v10Data = data.asV10
    return {
      tokenId: v10Data.tokenId,
      accounts: [v10Data.sender, v10Data.recipient]
    }
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export const getTokenLiftedData = (ctx: ChainContext, event: Event): ReturnedData => {
  const data = new TokenManagerTokenLiftedEvent(ctx, event)

  if (data.isV10) {
    const v10Data = data.asV10
    return {
      tokenId: v10Data.tokenId,
      accounts: [v10Data.recipient]
    }
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}
