import { Ctx } from '.'
import {
  BatchNftMetadata,
  BatchNftMintedEventItem,
  NftMetadata,
  NftTransferEventItem,
  SingleNftMetadata,
  SingleNftMintedEventItem
} from './types/custom'
import {
  NftManagerSingleNftMintedEvent,
  NftManagerBatchNftMintedEvent,
  NftManagerFiatNftTransferEvent,
  NftManagerEthNftTransferEvent
} from './types/generated/parachain-dev/events'
import { encodeId } from '@avn/utils'
import { SubstrateBlock, toHex } from '@subsquid/substrate-processor'
import { handleSignedMintBatchNft, handleSignedMintSingleNft } from './callHandlers'

class UknownVersionError extends Error {
  constructor() {
    super('Unknown verson')
  }
}

export function handleSingleNftMintedEventItem(
  item: SingleNftMintedEventItem,
  block: SubstrateBlock,
  ctx: Ctx
): SingleNftMetadata {
  const event = new NftManagerSingleNftMintedEvent(ctx, item.event)
  if (event.isV21) {
    const { nftId, owner } = event.asV21
    const call = item.event.call
    if (!call) throw new Error(`missing related call data in ${item.name} event item`)
    const args = handleSignedMintSingleNft(call)
    const { t1Authority, royalties, uniqueExternalRef } = args
    return {
      id: nftId.toString(),
      owner: encodeId(owner),
      mintBlock: block.height,
      mintDate: new Date(block.timestamp),
      t1Authority,
      royalties,
      uniqueExternalRef
    }
  }
  throw new UknownVersionError()
}

export function handleBatchNftMintedEventItem(
  item: BatchNftMintedEventItem,
  block: SubstrateBlock,
  ctx: Ctx
): BatchNftMetadata {
  const event = new NftManagerBatchNftMintedEvent(ctx, item.event)
  if (event.isV21) {
    const { nftId, owner, authority, batchNftId } = event.asV21
    const call = item.event.call
    if (!call) throw new Error(`missing related call data in ${item.name} event item`)
    const args = handleSignedMintBatchNft(call)
    const { index, batchId, uniqueExternalRef } = args
    return {
      id: nftId.toString(),
      owner: encodeId(owner),
      mintBlock: block.height,
      mintDate: new Date(block.timestamp),
      uniqueExternalRef,
      t1Authority: toHex(authority),
      batchId,
      index
    }
  }
  throw new UknownVersionError()
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
