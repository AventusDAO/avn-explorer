import { BatchContext, BatchProcessorItem, SubstrateBlock } from '@subsquid/substrate-processor'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import { Batch, Nft, NftRoyalty } from './model'
import { NftEventItem, NftMetadata, NftTransferEventItem } from './types/custom'
import {
  handleBatchCreatedEventItem,
  handleBatchNftMintedEventItem,
  handleSingleNftMintedEventItem,
  handleTransferredNfts
} from './eventHandlers'
import { processor } from './processor'
import { In } from 'typeorm'
// import { CallItem, EventItem } from '@subsquid/substrate-processor/lib/interfaces/dataSelection'

// export type Item = Omit<
//   BatchProcessorItem<typeof processor>,
//   EventItem<'*', false> & CallItem<'*', false>
// >
export type Item = BatchProcessorItem<typeof processor>
export type Ctx = BatchContext<Store, Item>

processor.run(new TypeormDatabase(), processData)

async function processData(ctx: Ctx): Promise<void> {
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

  ctx.log.info(
    `blocks: #${data[0].block.height} - #${data[data.length - 1].block.height}, count: ${
      data.length
    }`
  )

  // get newly created NftBatches and save in DB
  const createdBatches = data
    .filter(item => item.event.name === 'NftManager.BatchCreated')
    .map(item => {
      if (item.event.name === 'NftManager.BatchCreated') {
        const metadata = handleBatchCreatedEventItem(item.event, item.block, ctx)
        return new Batch({
          ...metadata,
          royalties: metadata.royalties.map(r => new NftRoyalty(undefined, r))
        })
      }
      throw new Error('unexpected event item')
    })

  ctx.log.debug(createdBatches)
  await ctx.store.insert(createdBatches)

  // get all newly minted NFTs and save in DB
  const mintedNfts = data
    .filter(
      item =>
        item.event.name === 'NftManager.SingleNftMinted' ||
        item.event.name === 'NftManager.BatchNftMinted'
    )
    .map(item => {
      if (item.event.name === 'NftManager.SingleNftMinted') {
        const metadata = handleSingleNftMintedEventItem(item.event, item.block, ctx)
        return new Nft({
          ...metadata,
          royalties: metadata.royalties.map(r => new NftRoyalty(undefined, r))
        })
      } else if (item.event.name === 'NftManager.BatchNftMinted') {
        const metadata = handleBatchNftMintedEventItem(item.event, item.block, ctx)
        return new Nft({
          ...metadata
        })
      }
      throw new Error('unexpected event item')
    })

  // ctx.log.debug(mintedNfts)
  await ctx.store.insert(mintedNfts)

  // get all other events and overwrite the owner
  const transferNftsData = data
    .filter(
      item =>
        item.event.name === 'NftManager.FiatNftTransfer' ||
        item.event.name === 'NftManager.EthNftTransfer'
    )
    .map(item => {
      return handleTransferredNfts(item.event as NftTransferEventItem, item.block, ctx)
    })

  // ctx.log.debug(transferNftsData)
  await updateTransferNfts(transferNftsData, ctx)
}

async function updateTransferNfts(
  nftsMetadata: Array<Pick<NftMetadata, 'id' | 'owner'>>,
  ctx: Ctx
): Promise<void> {
  const existingNfts = await ctx.store.find(Nft, {
    where: {
      id: In(nftsMetadata.map(nft => nft.id))
    }
  })

  const nfts: Nft[] = nftsMetadata.map(nftData => {
    const { id, owner } = nftData
    const existingNft = existingNfts.find(nft => nft.id === id)
    if (!existingNft) throw new Error('Transferred NFT does not exist in the DB')
    return new Nft({
      ...existingNft,
      owner
    })
  })

  await ctx.store.upsert(nfts)
}
