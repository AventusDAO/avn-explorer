import { BatchContext, BatchProcessorItem } from '@subsquid/substrate-processor'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import { Nft } from './model'
import { In } from 'typeorm'
import { MintedNftEventData } from './types/custom'
import { handleMintedNfts } from './eventHandlers'
import { processor } from './processor'

export type Item = BatchProcessorItem<typeof processor>
export type Ctx = BatchContext<Store, Item>

processor.run(new TypeormDatabase(), processEvents)

async function processEvents(ctx: Ctx): Promise<void> {
  const nftData: MintedNftEventData[] = []
  for (const block of ctx.blocks) {
    for (const item of block.items) {
      if (item.name === 'NftManager.SingleNftMinted' || item.name === 'NftManager.BatchNftMinted') {
        nftData.push(handleMintedNfts(ctx, item))
      }
    }
  }
  await saveTransfers(ctx, nftData)
}

async function saveTransfers(ctx: Ctx, mintedNftsData: MintedNftEventData[]): Promise<void> {
  const accountIds = new Set<string>()
  for (const t of mintedNftsData) {
    accountIds.add(t.owner)
  }
  const accounts = await ctx.store
    .findBy(Nft, { owner: In([...accountIds]) })
    .then((q: any) => q.map((i: any) => i.fromId))

  const nfts: Nft[] = []

  for (const t of mintedNftsData) {
    const { id, nftId } = t
    const owner = getAccount(accounts, t.owner)
    nfts.push(
      new Nft({
        id,
        nftId,
        owner
      })
    )
  }
  await ctx.store.insert(nfts)
}

function getAccount(m: string[], id: string): string {
  const acc = m.includes(id)
  if (acc === null || acc === undefined) {
    m.push(id, id)
  }
  return id
}
