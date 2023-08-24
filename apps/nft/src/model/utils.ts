import { uint8ArrToHexStr } from '@avn/utils'
import * as v4 from '../types/generated/parachain-testnet/v4'
import { NftRoyalty, NftRoyaltyRate } from './generated'

export const getNftRoyaltiesModel = (nftInfo: v4.NftInfo): NftRoyalty[] => {
  const royalties = nftInfo.royalties.map(
    r =>
      new NftRoyalty({
        rate: new NftRoyaltyRate({
          ...r.rate
        }),
        recipientT1Address: uint8ArrToHexStr(r.recipientT1Address)
      })
  )
  return royalties
}
