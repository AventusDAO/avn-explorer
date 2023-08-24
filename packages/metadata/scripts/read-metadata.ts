import { Si1TypeDefVariant } from '@subsquid/substrate-metadata'
import { getMetadata } from '../src/index'

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const getAllEvents = (specId: string, versionsFileName: string) => {
  const meta = getMetadata(versionsFileName, specId)
  if (meta.__kind !== 'V14') throw new Error('Unsupported Metadata version')

  const { pallets } = meta.value

  const data = pallets.map(p => {
    const eventsIndex = p.events?.type
    if (eventsIndex === undefined) {
      console.debug(`Cannot find event index for pallet ${p.name}`)
      return {
        name: p.name,
        events: []
      }
    }
    const eventType = meta.value.lookup.types.find(t => t.id === eventsIndex)
    if (!eventType) {
      console.debug(`Lookup types missing for event index ${eventsIndex} for pallet ${p.name}`)
      return {
        name: p.name,
        events: []
      }
    }
    const eventNames = (eventType.type.def.value as Si1TypeDefVariant).variants.map(v => v.name)
    return {
      name: p.name,
      events: eventNames
    }
  })

  return data.filter(x => x.events.length > 0).sort((a, b) => a.name.localeCompare(b.name))
}

const eventsMetadata = getAllEvents('avn-parachain@37', 'versions.avn-parachain.dev.jsonl')
console.log(eventsMetadata)
