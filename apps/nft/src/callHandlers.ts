import { Ctx } from '.'
import { NftMintCallArgs, NftMintEventCall, ProxyCallArgs } from './types'

export function normalizeCallArgs(callItem: NftMintEventCall, _ctx: Ctx): NftMintCallArgs {
  const { args } = callItem
  if (!callItem.name.includes('proxy')) {
    // NOTE: args.call.__kind === 'NftManager' && args.call.value.__kind === 'signed_mint_single_nft'
    return args.call.value
  }

  // NOTE: proxy call requires manual typing
  const proxyArgs = args as ProxyCallArgs<NftMintCallArgs>
  const { royalties, t1Authority, uniqueExternalRef } = proxyArgs.call.value
  return {
    royalties,
    t1Authority,
    uniqueExternalRef
  }
}
