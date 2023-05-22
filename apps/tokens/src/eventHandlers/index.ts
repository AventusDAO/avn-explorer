import { ChainContext, Event } from '../types/generated/parachain-dev/support'
import {
  TokenManagerTokenLiftedEvent,
  TokenManagerTokenLoweredEvent,
  TokenManagerTokenTransferredEvent
} from '../types/generated/parachain-dev/events'
import { toHex } from '@subsquid/substrate-processor'
import { UnknownVersionError } from '@avn/types'

type AccountData = string[]

type ReturnedData = {
  tokenId: string
  accounts?: AccountData
}

export const getTokenLowerData = (ctx: ChainContext, event: Event): ReturnedData => {
  const data = new TokenManagerTokenLoweredEvent(ctx, event)

  if (data.isV21) {
    const v10Data = data.asV21
    return {
      tokenId: toHex(v10Data.tokenId),
      accounts: [toHex(v10Data.sender), toHex(v10Data.recipient)]
    }
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export const getTokenTransferredData = (ctx: ChainContext, event: Event): ReturnedData => {
  const data = new TokenManagerTokenTransferredEvent(ctx, event)

  if (data.isV21) {
    const v10Data = data.asV21
    return {
      tokenId: toHex(v10Data.tokenId),
      accounts: [toHex(v10Data.sender), toHex(v10Data.recipient)]
    }
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}

export const getTokenLiftedData = (ctx: ChainContext, event: Event): ReturnedData => {
  const data = new TokenManagerTokenLiftedEvent(ctx, event)

  if (data.isV21) {
    const v10Data = data.asV21
    return {
      tokenId: toHex(v10Data.tokenId),
      accounts: [toHex(v10Data.recipient)]
    }
  } else {
    throw new UnknownVersionError(data.constructor.name)
  }
}
