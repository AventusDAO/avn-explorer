import { BatchContext, BatchProcessorItem, SubstrateBlock } from '@subsquid/substrate-processor'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import { Nft, NftRoyalty } from './model'
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
  interface NftDataItem {
    block: SubstrateBlock
    event: NftEventItem
  }
  const data: NftDataItem[] = ctx.blocks
    .map(block =>
      block.items
        .filter(item => item.kind === 'event')
        .map(item => ({
          block: block.header,
          event: item as NftEventItem
        }))
    )
    .flat()

  // 1. get all newly minted NFTs and save in DB
  const mintedNftsData = data
    .filter(
      item =>
        item.event.name === 'NftManager.SingleNftMinted' ||
        item.event.name === 'NftManager.BatchNftMinted'
    )
    .map(item => {
      return handleMintedNfts(item.event as NftMintEventItem, item.block, ctx)
    })

  ctx.log.debug(mintedNftsData)
  await saveMintedNfts(mintedNftsData, ctx)

  // 2. TODO: get all other events and overwrite the owner
}

async function saveMintedNfts(mintedNftsData: NftMetadata[], ctx: Ctx): Promise<void> {
  const nfts: Nft[] = mintedNftsData.map(nftData => {
    const {
      id,
      owner,
      mintBlock,
      mintDate,
      royalties: _royalties,
      t1Authority,
      uniqueExternalRef
    } = nftData
    const royalties: NftRoyalty[] = _royalties.map(
      r =>
        new NftRoyalty(undefined, {
          ...r
        })
    )
    return new Nft({
      id,
      owner,
      mintBlock,
      mintDate,
      t1Authority,
      royalties,
      uniqueExternalRef
    })
  })

  await ctx.store.insert(nfts)
}
