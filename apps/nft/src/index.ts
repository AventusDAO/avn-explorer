import { BatchContext, BatchProcessorItem } from '@subsquid/substrate-processor'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import { Nft } from './model'
import { NftEventItem, NftEventName, NftMintEventData } from './types/custom'
import { handleMintedNfts } from './eventHandlers'
import { processor } from './processor'

export type Item = BatchProcessorItem<typeof processor>
export type Ctx = BatchContext<Store, Item>

processor.run(new TypeormDatabase(), processBatch)

async function processBatch(ctx: Ctx): Promise<void> {
  const events: Array<NftEventItem<NftEventName>> = ctx.blocks
    .map(block =>
      block.items
        .filter(item => item.kind === 'event')
        .map(item => item as NftEventItem<NftEventName>)
    )
    .flat()

  // 1. get all newly minted NFTs and save in DB
  const mintedNftsData = events
    .filter(
      event =>
        event.name === 'NftManager.SingleNftMinted' || event.name === 'NftManager.BatchNftMinted'
    )
    .map(event => {
      return handleMintedNfts(
        ctx,
        event as
          | NftEventItem<'NftManager.SingleNftMinted'>
          | NftEventItem<'NftManager.BatchNftMinted'>
      )
    })

  ctx.log.debug(mintedNftsData)
  await saveMintedNfts(ctx, mintedNftsData)

  // 2. TODO: get all other events and overwrite the owner
}

async function saveMintedNfts(ctx: Ctx, mintedNftsData: NftMintEventData[]): Promise<void> {
  const nfts: Nft[] = mintedNftsData.map(d => {
    return new Nft({
      id: d.id,
      owner: d.owner
    })
  })

  await ctx.store.insert(nfts)
}