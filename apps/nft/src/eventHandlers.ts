import { Ctx } from '.'
import { NftMetadata, NftMintEventItem } from './types/custom'
import {
  NftManagerSingleNftMintedEvent,
  NftManagerBatchNftMintedEvent
} from './types/generated/parachain-dev/events'
import { encodeId } from '@avn/utils'
import { normalizeCallArgs } from './callHandlers'
import { SubstrateBlock } from '@subsquid/substrate-processor'

class UknownVersionError extends Error {
  constructor() {
    super('Unknown verson')
  }
}

export function handleMintedNfts(item: NftMintEventItem, block: SubstrateBlock, ctx: Ctx): NftMetadata {
  const event = normalizeMintNftEvent(item, ctx)
  const call = item.event.call
  if (!call) throw new Error(`missing related call data in ${item.name} event item`)
  const args = normalizeCallArgs(call, ctx)
  const { t1Authority, royalties, uniqueExternalRef } = args
  return {
    id: event.nftId.toString(),
    owner: encodeId(event.owner),
    mintBlock: block.height,
    mintDate: new Date(block.timestamp),
    t1Authority,
    royalties,
    uniqueExternalRef
  }
}

function normalizeMintNftEvent(
  item: NftMintEventItem,
  ctx: Ctx
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
