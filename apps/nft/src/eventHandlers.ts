import { Ctx } from '.'
import { NftMetadata, NftMintEventItem } from './types/custom'
import {
  NftManagerSingleNftMintedEvent,
  NftManagerBatchNftMintedEvent
} from './types/generated/parachain-dev/events'
import { encodeId } from '@avn/utils'
import { MintCallItem } from './types/custom/call'

class UknownVersionError extends Error {
  constructor() {
    super('Unknown verson')
  }
}

// TODO: add other properties from the call (use NftMetadata interface)
export function handleMintedNfts(ctx: Ctx, item: NftMintEventItem): NftMetadata {
  const event = normalizeMintNftEvent(ctx, item)
  const call = item.event.call
  if (!call) throw new Error(`missing related call data in ${item.name} event item`)
  const args = normalizeCallArgs(call.args)
  console.log(args)
  return {
    id: event.nftId.toString(),
    owner: encodeId(event.owner),
    // TODO: process call args
    mintBlock: 0,
    mintDate: new Date(),
    t1Authority: '',
    royalties: [],
    uniqueExternalRef: ''
  }
}

function normalizeMintNftEvent(
  ctx: Ctx,
  item: NftMintEventItem
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

function normalizeCallArgs(callItem: MintCallItem) {
  const { args } = callItem.call
  // TODO: normalize args
  return args
}
