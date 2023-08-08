import { BatchContext, BatchProcessorItem, SubstrateBlock } from '@subsquid/substrate-processor'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import { Nft, NftRoyalty } from './model'
import { NftEventItem, NftMetadata, NftMintEventItem, NftTransferEventItem } from './types/custom'
import { handleMintedNfts, handleTransferredNfts } from './eventHandlers'
import { processor } from './processor'
import { In } from 'typeorm'
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

  // get all newly minted NFTs and save in DB
  const mintedNftsData = data
    .filter(
      item =>
        item.event.name === 'NftManager.SingleNftMinted' ||
        item.event.name === 'NftManager.BatchNftMinted'
    )
    .map(item => {
      return handleMintedNfts(item.event as NftMintEventItem, item.block, ctx)
    })

  // ctx.log.debug(mintedNftsData)
  await saveMintedNfts(mintedNftsData, ctx)

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
