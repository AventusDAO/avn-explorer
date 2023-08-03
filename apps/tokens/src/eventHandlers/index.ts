import { ChainContext, Event } from '../types/generated/parachain-dev/support'
import {
  TokenManagerTokenLiftedEvent,
  TokenManagerTokenLoweredEvent,
  TokenManagerTokenTransferredEvent
} from '../types/generated/parachain-dev/events'
import {
  TokenManagerTokenLiftedEvent as SoloTokenManagerTokenLiftedEvent,
  TokenManagerTokenLoweredEvent as SoloTokenManagerTokenLoweredEvent,
  TokenManagerTokenTransferredEvent as SoloTokenManagerTokenTransferredEvent
} from '../types/generated/solochain-mainnet/events'
import { toHex } from '@subsquid/substrate-processor'
import { UnknownVersionError } from '@avn/types'
import { TokenTransferData } from '../processor'
import { ChainGen, getEnvironment } from '@avn/config'

type AccountData = string[]

type ReturnedData = {
  tokenId: string
  accounts?: AccountData
}

export const getTokenLowerData = (ctx: ChainContext, event: Event): TokenTransferData => {
  const environment = getEnvironment()
  if (environment.chainGen === ChainGen.parachain) {
    const data = new TokenManagerTokenLoweredEvent(ctx, event)

    if (data.isV21) {
      const v10Data = data.asV21
      return {
        tokenId: toHex(v10Data.tokenId),
        accountId: toHex(v10Data.recipient),
        amount: v10Data.amount
      }
    } else {
      throw new UnknownVersionError(data.constructor.name)
    }
  } else {
    const data = new SoloTokenManagerTokenLoweredEvent(ctx, event)

    if (data.isV1) {
      const v10Data = data.asV1
      return {
        tokenId: toHex(v10Data[0]),
        accountId: toHex(v10Data[2]),
        amount: v10Data[3]
      }
    } else {
      throw new UnknownVersionError(data.constructor.name)
    }
  }
}

export const getTokenTransferredData = (ctx: ChainContext, event: Event): TokenTransferData => {
  const environment = getEnvironment()
  if (environment.chainGen === ChainGen.parachain) {
    const data = new TokenManagerTokenTransferredEvent(ctx, event)

    if (data.isV21) {
      const v10Data = data.asV21
      return {
        tokenId: toHex(v10Data.tokenId),
        accountId: toHex(v10Data.recipient),
        amount: v10Data.tokenBalance
      }
    } else {
      throw new UnknownVersionError(data.constructor.name)
    }
  } else {
    const data = new SoloTokenManagerTokenTransferredEvent(ctx, event)

    if (data.isV1) {
      // [TokenId, SenderAccountId, RecipientAccountId, TokenBalance]
      const v10Data = data.asV1
      return {
        tokenId: toHex(v10Data[0]),
        accountId: toHex(v10Data[2]),
        amount: v10Data[3]
      }
    } else {
      throw new UnknownVersionError(data.constructor.name)
    }
  }
}

export const getTokenLiftedData = (ctx: ChainContext, event: Event): TokenTransferData => {
  const environment = getEnvironment()
  if (environment.chainGen === ChainGen.parachain) {
    const data = new TokenManagerTokenLiftedEvent(ctx, event)

    if (data.isV21) {
      const v10Data = data.asV21
      return {
        tokenId: toHex(v10Data.tokenId),
        accountId: toHex(v10Data.recipient),
        amount: v10Data.tokenBalance
      }
    } else {
      throw new UnknownVersionError(data.constructor.name)
    }
  } else {
    const data = new SoloTokenManagerTokenLiftedEvent(ctx, event)

    if (data.isV1) {
      const v10Data = data.asV1
      return {
        tokenId: toHex(v10Data[0]),
        accountId: toHex(v10Data[1]),
        amount: v10Data[2]
      }
    } else {
      throw new UnknownVersionError(data.constructor.name)
    }
  }
}
