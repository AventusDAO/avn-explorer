import { environment } from '@avn/config'
import { getMetadata } from '@avn/metadata'

export const decodeError = (): void => {
  // const meta = decodeMetadata(metadata)
  // console.log(meta.value.pallets[0].errors)

  const meta = getMetadata(environment.name)
  console.log(meta)
}
