// import { CodecType, CodecStructType } from '@subsquid/scale-codec/src/types-codec'
import { Ctx } from '.'
import { MigrationCallItem } from './types'
import { MigrationMigrateNftsCall } from './types/generated/parachain-testnet/calls'
import { NftManagerNftsStorage } from './types/generated/parachain-testnet/storage'

function reverseEndian(endian: string): string {
  const matches = endian.match(/../g) ?? []
  return '0x' + matches.reverse().join('')
}

export const handleNftsMigration = async (item: MigrationCallItem, ctx: Ctx) => {
  const data = new MigrationMigrateNftsCall(ctx, item.call)
  if (!data.isV12) throw new Error('Unexpected version')
  const migrationNfts = data.asV12.nfts
  const nftKeys = migrationNfts.map(x => x[0]).map(k => Buffer.from(k).toString('hex'))
  /**
    0x
    d8bf2414679493e5a8f33ebae762fd6a // 53 length
    e8d49389c2e23e152fdd6364daadd2cc // 53 length
    b3df41db3caad46704c0f4aa6ab514af // 53 length
    d631de13f12014a3c23c2b07fd8ba2df9006bb4eccbeaf69c753ca2dfcf02b0a // 64
   */
  console.log('nftKeys', nftKeys)
  const nftIds = nftKeys
    .map(k => k.slice(3 * 32, k.length))
    // .map(s => `0x${s}`)
    .map(s => {
      console.log(s)
      return s
    })
    .map(reverseEndian)
    .map(s => BigInt(s))
  console.log('nftIds', nftIds)
  const block = ctx.blocks[ctx.blocks.length - 1].header
  console.log('HEADER', block.hash)
  const storage = new NftManagerNftsStorage(ctx, block)
  // const nfts = await storage.asV4.getAll()
  const nfts = await storage.asV4.getMany(nftIds)
  console.log(nfts)
  return nfts
}
