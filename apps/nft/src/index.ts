import { BatchContext, BatchProcessorItem } from '@subsquid/substrate-processor'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import { Nft } from './model'
import { NftEventItem, NftMetadata, NftMintEventItem } from './types/custom'
import { handleMintedNfts } from './eventHandlers'
import { processor } from './processor'
// import { CallItem, EventItem } from '@subsquid/substrate-processor/lib/interfaces/dataSelection'

// export type Item = Omit<
//   BatchProcessorItem<typeof processor>,
//   EventItem<'*', false> & CallItem<'*', false>
// >
export type Item = BatchProcessorItem<typeof processor>
export type Ctx = BatchContext<Store, Item>

processor.run(new TypeormDatabase(), processBatch)

async function processBatch(ctx: Ctx): Promise<void> {
  const events: NftEventItem[] = ctx.blocks
    .map(block =>
      block.items.filter(item => item.kind === 'event').map(item => item as NftEventItem)
    )
    .flat()

  // 1. get all newly minted NFTs and save in DB
  const mintedNftsData = events
    .filter(
      event =>
        event.name === 'NftManager.SingleNftMinted' || event.name === 'NftManager.BatchNftMinted'
    )
    .map(event => {
      return handleMintedNfts(ctx, event as NftMintEventItem)
    })

  ctx.log.debug(mintedNftsData)
  await saveMintedNfts(ctx, mintedNftsData)

  // 2. TODO: get all other events and overwrite the owner
}

async function saveMintedNfts(ctx: Ctx, mintedNftsData: NftMetadata[]): Promise<void> {
  const nfts: Nft[] = mintedNftsData.map(d => {
    return new Nft({
      id: d.id,
      owner: d.owner
    })
  })

  await ctx.store.insert(nfts)
}