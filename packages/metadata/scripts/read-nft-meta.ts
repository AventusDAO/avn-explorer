import { Si1TypeDef_Composite } from '@subsquid/substrate-metadata'
import { getMetadata } from '../src/index'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const getNftTypes = (specId: string, versionsFileName: string) => {
  const meta = getMetadata(versionsFileName, specId)
  if (meta.__kind !== 'V14') throw new Error('Unsupported Metadata version')

  const { pallets } = meta.value

  const data = pallets.map(p => {
    return p
  })

  const nftPallet = data.find(p => p.name === 'NftManager')
  const nftsStorageItems = nftPallet?.storage?.items.find(i => i.name === 'Nfts')
  const nftValueIndex = nftsStorageItems?.type.value
  const lookupType = meta.value.lookup.types.find(t => t.id === nftValueIndex)
  const def = lookupType?.type.def

  return def as Si1TypeDef_Composite
}

const metadata = getNftTypes('avn-parachain@31', 'versions.avn-parachain.dev.jsonl')
console.log(metadata)
