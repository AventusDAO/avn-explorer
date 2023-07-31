import { EventItem } from '@subsquid/substrate-processor/lib/interfaces/dataSelection'
import { Ctx, MintedNftEventItem } from '.'
import { MintedNftEventData } from './types/custom'
import {
  NftManagerSingleNftMintedEvent,
  NftManagerBatchNftMintedEvent
} from './types/generated/parachain-dev/events'
import { encodeId } from '@avn/utils'

class UknownVersionError extends Error {
  constructor() {
    super('Unknown verson')
  }
}

export function handleMintedNfts(ctx: Ctx, item: MintedNftEventItem): MintedNftEventData {
  const event = normalizeMintNftEvent(ctx, item)
  return {
    id: item.event.id,
    nftId: event.nftId,
    owner: encodeId(event.owner)
  }
}

export function normalizeMintNftEvent(
  ctx: Ctx,
  item:
    | EventItem<'NftManager.SingleNftMinted', { event: { args: true } }>
    | EventItem<'NftManager.BatchNftMinted', { event: { args: true } }>
): { nftId: bigint; owner: Uint8Array } {
  const e =
    item.name === 'NftManager.SingleNftMinted'
      ? new NftManagerSingleNftMintedEvent(ctx, item.event)
      : new NftManagerBatchNftMintedEvent(ctx, item.event)
  if (e.isV21) {
    const { nftId, owner } = e.asV21
    return { nftId, owner }
  } else {
    throw new UknownVersionError()
  }
}
