import { BatchContext, BatchProcessorItem } from '@subsquid/substrate-processor'
import { encodeId } from '@avn/utils'
import { EventItem } from '@subsquid/substrate-processor/lib/interfaces/dataSelection'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import { Nft } from './model'
import { getProcessor } from '@avn/config'
import { In } from 'typeorm'
import { MintedNftEventData } from './types/custom'
import { normalizeMintNftEvent } from './eventHandlers'

const processor = getProcessor()
  .addEvent('NftManager.BatchCreated', {
    data: {
      event: {
        args: true,
        extrinsic: {
          hash: true
        },
        call: {}
      }
    }
  } as const)
  .addEvent('NftManager.SingleNftMinted', {
    data: {
      event: {
        args: true,
        extrinsic: {
          hash: true
        },
        call: {}
      }
    }
  } as const)
  .addEvent('NftManager.BatchNftMinted', {
    data: {
      event: {
        args: true,
        extrinsic: {
          hash: true
        },
        call: {}
      }
    }
  } as const)
  .addEvent('NftManager.FiatNftTransfer', {
    data: {
      event: {
        args: true,
        extrinsic: {
          hash: true
        },
        call: {}
      }
    }
  } as const)
  .addEvent('NftManager.EthNftTransfer', {
    data: {
      event: {
        args: true,
        extrinsic: {
          hash: true
        },
        call: {}
      }
    }
  } as const)

export type Item = BatchProcessorItem<typeof processor>
export type Ctx = BatchContext<Store, Item>
export type MintedNftEventItem =
  | EventItem<
      'NftManager.SingleNftMinted',
      { event: { args: true; extrinsic: { hash: true }; call: {} } }
    >
  | EventItem<
      'NftManager.BatchNftMinted',
      { event: { args: true; extrinsic: { hash: true }; call: {} } }
    >

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

function handleMintedNfts(ctx: Ctx, item: MintedNftEventItem): MintedNftEventData {
  const event = normalizeMintNftEvent(ctx, item)
  return {
    id: item.event.id,
    nftId: event.nftId,
    owner: encodeId(event.owner)
  }
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
