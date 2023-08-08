import { Ctx } from '.'
import {
  BatchCreatedCallArgs,
  BatchCreatedEventItem,
  BatchMetadata,
  BatchNftMetadata,
  BatchNftMintedCallArgs,
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
  NftManagerEthNftTransferEvent,
  NftManagerBatchCreatedEvent
} from './types/generated/parachain-dev/events'
import { encodeId } from '@avn/utils'
import { SubstrateBlock, toHex } from '@subsquid/substrate-processor'
import {
  handleSignedCreateBatchCallItem,
  handleSignedMintBatchNftCallItem,
  handleSignedMintSingleNftCallItem
} from './callHandlers'

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
    const callArgs = handleSignedMintSingleNftCallItem(call)
    const { t1Authority, royalties, uniqueExternalRef } = callArgs
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
    const callArgs = handleSignedMintBatchNftCallItem(call)

    const {
      index: _index,
      batchId: _batchId,
      uniqueExternalRef: _uniqueExternalRef
    } = callArgs as Partial<BatchNftMintedCallArgs>
    // NOTE: work around corrupted `NftManager.BatchNftMinted` event that originates
    // from `EthereumEvents.process_event` instead of `NftManager` call.
    // There's only 1 occurence on public-testnet on parachain public-testnet
    // (event_id: 0000740775-000003-dc365, call_id: 0000740775-000002-dc365)
    const uniqueExternalRef = _uniqueExternalRef ?? ''
    const index = _index ?? 0

    return {
      id: nftId.toString(),
      owner: encodeId(owner),
      mintBlock: block.height,
      mintDate: new Date(block.timestamp),
      uniqueExternalRef,
      t1Authority: toHex(authority),
      batchId: batchNftId.toString(),
      index
    }
  }
  throw new UknownVersionError()
}

export function handleBatchCreatedEventItem(
  item: BatchCreatedEventItem,
  block: SubstrateBlock,
  ctx: Ctx
): BatchMetadata {
  const event = new NftManagerBatchCreatedEvent(ctx, item.event)
  if (event.isV21) {
    const { batchNftId, totalSupply, batchCreator, authority } = event.asV21
    const call = item.event.call
    if (!call) throw new Error(`missing related call data in ${item.name} event item`)
    const callArgs: BatchCreatedCallArgs = handleSignedCreateBatchCallItem(call)
    const { royalties } = callArgs
    return {
      id: batchNftId.toString(),
      owner: encodeId(batchCreator),
      mintBlock: block.height,
      mintDate: new Date(block.timestamp),
      royalties,
      t1Authority: toHex(authority),
      // assuming totalSupply is a safe int
      totalSupply: Number(totalSupply)
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
