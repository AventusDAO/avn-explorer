import { Ctx } from '.'
import { NftMintEventData, NftEventItem } from './types/custom'
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

// TODO: add other properties from the call (use NftMetadata interface)
export function handleMintedNfts(
  ctx: Ctx,
  item: NftEventItem<'NftManager.SingleNftMinted'> | NftEventItem<'NftManager.BatchNftMinted'>
): NftMintEventData {
  const event = normalizeMintNftEvent(ctx, item)
  return {
    id: event.nftId.toString(),
    owner: encodeId(event.owner)
  }
}

function normalizeMintNftEvent(
  ctx: Ctx,
  item: NftEventItem<'NftManager.SingleNftMinted'> | NftEventItem<'NftManager.BatchNftMinted'>
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
