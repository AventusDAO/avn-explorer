import { Ctx } from '.'
import { NftMetadata, NftMintEventItem, NftTransferEventItem } from './types/custom'
import {
  NftManagerSingleNftMintedEvent,
  NftManagerBatchNftMintedEvent,
  NftManagerFiatNftTransferEvent,
  NftManagerEthNftTransferEvent
} from './types/generated/parachain-dev/events'
import { encodeId } from '@avn/utils'
import { normalizeCallArgs } from './callHandlers'
import { SubstrateBlock } from '@subsquid/substrate-processor'

class UknownVersionError extends Error {
  constructor() {
    super('Unknown verson')
  }
}

export function handleMintedNfts(
  item: NftMintEventItem,
  block: SubstrateBlock,
  ctx: Ctx
): NftMetadata {
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

export function handleTransferredNfts(
  item: NftTransferEventItem,
  block: SubstrateBlock,
  ctx: Ctx
): Pick<NftMetadata, 'id' | 'owner'> {
  const event = normalizeTransferNftEvent(item, ctx)
  return {
    id: event.nftId.toString(),
    owner: encodeId(event.newOwner)
  }
}

function normalizeTransferNftEvent(
  item: NftTransferEventItem,
  ctx: Ctx
): { nftId: bigint; newOwner: Uint8Array } {
  if (item.name === 'NftManager.FiatNftTransfer') {
    const event = new NftManagerFiatNftTransferEvent(ctx, item.event)
    if (event.isV21) {
      const { nftId, newOwner } = event.asV21
      return { nftId, newOwner }
    }
  } else if (item.name === 'NftManager.EthNftTransfer') {
    const event = new NftManagerEthNftTransferEvent(ctx, item.event)
    if (event.isV21) {
      const { nftId, newOwner } = event.asV21
      return { nftId, newOwner }
    }
  }

  throw new UknownVersionError()
}
