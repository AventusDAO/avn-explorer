import { encodeId, reverseEndian, uint8ArrToHexStr } from '@avn/utils'
import { Ctx } from '.'
import { Nft, NftRoyalty, NftRoyaltyRate } from './model'
import { MigrationCallItem } from './types'
import { MigrationMigrateNftsCall } from './types/generated/parachain-testnet/calls'
import {
  NftManagerNftInfosStorage,
  NftManagerNftsStorage
} from './types/generated/parachain-testnet/storage'
import { Nft as V4Nft, NftInfo as V4NftInfo } from './types/generated/parachain-testnet/v4'

export const getMigratedNftIds = (item: MigrationCallItem, ctx: Ctx): bigint[] => {
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

const removeUndefinedItems = <T>(arr: Array<T | undefined>): T[] =>
  arr.filter(x => !!x).map(x => x as T)

export const getMigratedNfts = async (nftIds: bigint[], ctx: Ctx): Promise<Nft[]> => {
  const block = ctx.blocks[ctx.blocks.length - 1].header

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
      nft.nftId === 75192147361011253200690299112337059520822422747933994625323155140300140689581n
    ) {
      // corrupted or malicious `uniqueExternalRef`
      uniqueExternalRef = ''
    } else {
      uniqueExternalRef = nft.uniqueExternalRef.toString()
    }
    const t1Authority = uint8ArrToHexStr(nftInfo.t1Authority)

    const royalties = nftInfo.royalties.map(
      r =>
        new NftRoyalty({
          rate: new NftRoyaltyRate({
            ...r.rate
          }),
          recipientT1Address: uint8ArrToHexStr(r.recipientT1Address)
        })
    )

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
