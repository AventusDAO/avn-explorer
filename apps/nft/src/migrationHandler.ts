import { encodeId, reverseEndian, uint8ArrToHexStr } from '@avn/utils'
import { SubstrateBlock } from '@subsquid/substrate-processor'
import { Ctx } from '.'
import { BatchNft, Nft, NftRoyalty, NftRoyaltyRate } from './model'
import { getNftRoyaltiesModel } from './model/utils'
import { BatchNftMigrationCallItem, NftMigrationCallItem } from './types'
import {
  MigrationMigrateNftsCall,
  MigrationMigrateNftBatchesCall
} from './types/generated/parachain-testnet/calls'
import {
  NftManagerNftInfosStorage,
  NftManagerNftsStorage,
  NftManagerBatchInfoIdStorage
} from './types/generated/parachain-testnet/storage'
import { Nft as V4Nft, NftInfo as V4NftInfo } from './types/generated/parachain-testnet/v4'

const removeUndefinedItems = <T>(arr: Array<T | undefined>): T[] =>
  arr.filter(x => !!x).map(x => x as T)

const getLatestBlock = (ctx: Ctx): SubstrateBlock => ctx.blocks[ctx.blocks.length - 1].header

export const getMigratedNftIds = (item: NftMigrationCallItem, ctx: Ctx): bigint[] => {
  const data = new MigrationMigrateNftsCall(ctx, item.call)
  if (!data.isV12) throw new Error('Unexpected version')
  /* key definition:
    0x
    d8bf2414679493e5a8f33ebae762fd6a // 32 length
    e8d49389c2e23e152fdd6364daadd2cc // 32 length
    b3df41db3caad46704c0f4aa6ab514af // 32 length
    d631de13f12014a3c23c2b07fd8ba2df9006bb4eccbeaf69c753ca2dfcf02b0a // 64
   */
  const migrationNfts = data.asV12.nfts
  const nftKeys = migrationNfts.map(x => x[0]).map(k => Buffer.from(k).toString('hex'))
  const nftIds = nftKeys
    .map(k => k.slice(3 * 32, k.length))
    .map(reverseEndian)
    .map(s => BigInt(s))
  return nftIds
}

export const getMigratedBatchNftIds = (item: BatchNftMigrationCallItem, ctx: Ctx): bigint[] => {
  const data = new MigrationMigrateNftBatchesCall(ctx, item.call)
  if (!data.isV12) throw new Error('Unexpected version')
  /* key definition:
    0x
    d8bf2414679493e5a8f33ebae762fd6a // 32 length
    d5245e3f16ad98c547b8632db16d5f96 // 32 length
    0d2052a773df2c53ea6776aaad04a36c // 32 length
    eba35af660f1d06dc8970dae5ff6120aaca26ccdc8fb9156c8ac96d460c784fa
   */
  const migrationNfts = data.asV12.batches
  const nftKeys = migrationNfts.map(x => x[0]).map(uint8ArrToHexStr)
  const batchNftIds = nftKeys
    .map(k => k.replace('0x', '').slice(3 * 32))
    .map(reverseEndian)
    .map(BigInt)
  return batchNftIds
}

export const getMigratedNftBatches = async (
  batchNftIds: bigint[],
  ctx: Ctx
): Promise<BatchNft[]> => {
  const block = getLatestBlock(ctx)

  const storage = new NftManagerBatchInfoIdStorage(ctx, block)
  const batchInfoIds = await storage.asV4.getMany(batchNftIds)
  const batchIdToInfoIdMap = new Map<bigint, bigint>()
  batchNftIds.forEach((batchId, idx) => {
    batchIdToInfoIdMap.set(batchId, batchInfoIds[idx])
  })

  const infoStorage = new NftManagerNftInfosStorage(ctx, block)
  const nftInfos: V4NftInfo[] = removeUndefinedItems(await infoStorage.asV4.getMany(batchInfoIds))

  const batches = nftInfos.map(info => {
    const { batchId, creator } = info
    if (!batchId || !creator) throw new Error('Unexpected undefined batch data')
    const id = batchId.toString()
    const owner = encodeId(creator)
    const t1Authority = uint8ArrToHexStr(info.t1Authority)
    const royalties = getNftRoyaltiesModel(info)
    const totalSupply = Number(info.totalSupply)

    return new BatchNft({
      id,
      owner,
      mintBlock: block.height,
      mintDate: new Date(block.timestamp),
      t1Authority,
      royalties,
      totalSupply
    })
  })

  return batches
}

export const getMigratedNfts = async (nftIds: bigint[], ctx: Ctx): Promise<Nft[]> => {
  const block = getLatestBlock(ctx)

  const storage = new NftManagerNftsStorage(ctx, block)
  const storageNfts: V4Nft[] = removeUndefinedItems(await storage.asV4.getMany(nftIds))

  const infoStorage = new NftManagerNftInfosStorage(ctx, block)
  const nftInfos: V4NftInfo[] = removeUndefinedItems(
    await infoStorage.asV4.getMany(storageNfts.map(nft => nft.infoId))
  )

  const nfts = storageNfts.map((nft, idx) => {
    const nftInfo: V4NftInfo = nftInfos[idx]

    const mintDate = new Date(block.timestamp)
    let uniqueExternalRef: string
    if (
      // workaround corrupted or malicious `uniqueExternalRef` on a single parachain testnet NFT item
      nft.nftId === 75192147361011253200690299112337059520822422747933994625323155140300140689581n
    ) {
      uniqueExternalRef = ''
    } else {
      uniqueExternalRef = nft.uniqueExternalRef.toString()
    }
    const t1Authority = uint8ArrToHexStr(nftInfo.t1Authority)
    const royalties = getNftRoyaltiesModel(nftInfo)

    return new Nft({
      id: nft.nftId.toString(),
      owner: encodeId(nft.owner),
      mintBlock: block.height,
      mintDate,
      uniqueExternalRef,
      t1Authority,
      royalties,
      batchId: nftInfo.batchId?.toString()
    })
  })

  return nfts
}
