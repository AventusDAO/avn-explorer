import { Ctx } from '.'
import { NftMintCallArgs, NftMintEventCall } from './types'

export function normalizeCallArgs(callItem: NftMintEventCall, _ctx: Ctx): NftMintCallArgs {
  const { args } = callItem
  if (!callItem.name.includes('proxy')) {
    return args.call.value
  }

  // NOTE: args.call.__kind === 'NftManager' && args.call.value.__kind === 'signed_mint_single_nft'
  const { royalties, t1Authority, uniqueExternalRef } = args.call.value
  return {
    royalties,
    t1Authority,
    uniqueExternalRef
  }
}
