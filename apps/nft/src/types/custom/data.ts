export interface NftRoyalty {
  rate: {
    partsPerMillion: number
  }
  recipientT1Address: string
}

export interface NftMetadata {
  id: string
  mintBlock: number
  mintDate: Date
  owner: string
  t1Authority: string
  royalties: NftRoyalty[]
  uniqueExternalRef: string
}
