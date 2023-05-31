import { environment } from '@avn/config'
import { getMetadata } from '@avn/metadata'

export const decodeError = (index: number, error: string, blockHeight: number): string => {
  const meta = getMetadata(environment.name, blockHeight)
  if (meta.__kind !== 'V14') throw new Error('Unsupported Metadata version')

  const { pallets } = meta.value
  const palletData = pallets.find(p => p.index === index)
  if (palletData === undefined) {
    throw new Error(`Cannot find pallet with index ${index}`)
  }

  const errorIndex = palletData.errors?.type
  if (errorIndex === undefined) {
    throw new Error(`Cannot find error type for pallet ${palletData.name}`)
  }

  const errorType = meta.value.lookup.types.find(t => t.id === errorIndex)
  if (!errorType) {
    throw new Error(`Cannot find error type with index ${errorIndex}`)
  }

  const defIndex = parseInt(error.substring(2, 4), 16) // 0x02000000 => 0x02 => 2
  if (errorType.type.def.__kind !== 'Variant') {
    throw new Error('Unsupported error type')
  }

  const errorVariant = errorType.type.def.value.variants.find(e => e.index === defIndex)
  if (!errorVariant) {
    throw new Error(`Cannot find error variant for ${error} with index ${defIndex}`)
  }

  return `${palletData.name}.${errorVariant.name}`
}
