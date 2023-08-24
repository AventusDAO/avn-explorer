import { BatchContext, BatchProcessorItem, SubstrateBlock } from '@subsquid/substrate-processor'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import { BatchNft, Nft, NftRoyalty } from './model'
import {
  NftMigrationCallItem,
  NftEventItem,
  NftMetadata,
  NftTransferEventItem,
  BatchNftMigrationCallItem
} from './types/custom'
import {
  handleBatchCreatedEventItem,
  handleBatchNftMintedEventItem,
  handleSingleNftMintedEventItem,
  handleTransferredNfts
} from './eventHandlers'
import { processor } from './processor'
import { In } from 'typeorm'
import {
  getMigratedBatchNftIds,
  getMigratedNftBatches,
  getMigratedNftIds,
  getMigratedNfts
} from './migrationHandler'

export type Item = BatchProcessorItem<typeof processor>
export type Ctx = BatchContext<Store, Item>

processor.run(new TypeormDatabase(), processData)

async function processData(ctx: Ctx): Promise<void> {
  ctx.log.info(
    `processing blocks range: #${ctx.blocks[0].header.height} - #${
      ctx.blocks[ctx.blocks.length - 1].header.height
    }`
  )

  // handle migration calls and store in the DB

  const migratedBatchNftIds = ctx.blocks
    .map(block =>
      block.items
        .filter(item => item.kind === 'call' && item.call.name === 'Migration.migrate_nft_batches')
        .map(item => item as BatchNftMigrationCallItem)
    )
    .flat()
    .map(item => getMigratedBatchNftIds(item, ctx))
    .flat()

  const migratedNftBatches = await getMigratedNftBatches(migratedBatchNftIds, ctx)
  await ctx.store.insert(migratedNftBatches)
  if (migratedNftBatches.length)
    ctx.log.info(`stored ${migratedNftBatches.length} migrated BatchNFTs`)

  const migratedNftIds = ctx.blocks
    .map(block =>
      block.items
        .filter(item => item.kind === 'call' && item.call.name === 'Migration.migrate_nfts')
        .map(item => item as NftMigrationCallItem)
    )
    .flat()
    .map(item => getMigratedNftIds(item, ctx))
    .flat()

  const migratedNfts = await getMigratedNfts(migratedNftIds, ctx)
  await ctx.store.insert(migratedNfts)
  if (migratedNfts.length) ctx.log.info(`stored ${migratedNfts.length} migrated NFTs`)

  // handle non migration events

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

  if (data.length === 0) return

  // get newly created NftBatches and save in DB
  const createdBatches = data
    .filter(item => item.event.name === 'NftManager.BatchCreated')
    .map(item => {
      if (item.event.name === 'NftManager.BatchCreated') {
        const metadata = handleBatchCreatedEventItem(item.event, item.block, ctx)
        return new BatchNft({
          ...metadata,
          royalties: metadata.royalties.map(r => new NftRoyalty(undefined, r))
        })
      }
      throw new Error('unexpected event item')
    })

  // ctx.log.debug(createdBatches)
  await ctx.store.insert(createdBatches)
  if (createdBatches.length) ctx.log.info(`stored ${createdBatches.length} created NFT Batches`)

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
  if (mintedNfts.length) ctx.log.info(`stored ${mintedNfts.length} minted NFTs`)

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

  const nftTransferUpdates = await getNftTransferUpdates(transferNftsData, ctx)
  // ctx.log.debug(nftTransferUpdates)

  // get the unique (last) NFT transfer in the batch to fix QueryFailedError: "ON CONFLICT DO UPDATE command cannot affect row a second time"
  // ensures that no rows proposed for insertion within the same command have duplicate constrained values
  const uniqueNftTransferUpdates = new Map<string, Nft>()
  nftTransferUpdates.forEach(nft => {
    uniqueNftTransferUpdates.set(nft.id, nft)
  })
  await ctx.store.upsert([...uniqueNftTransferUpdates.values()])
  if (nftTransferUpdates.length)
    ctx.log.info(`stored ${nftTransferUpdates.length} NFT transfer updates`)
}

async function getNftTransferUpdates(
  nftsMetadata: Array<Pick<NftMetadata, 'id' | 'owner'>>,
  ctx: Ctx
): Promise<Nft[]> {
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

  return nfts
}
