import { decodeMetadata, Metadata, Si1TypeDef_Composite } from '@subsquid/substrate-metadata'
import { readLines } from '@subsquid/util-internal-read-lines'
import path from 'path'

export interface SpecVersionRecord {
  specName: string
  specVersion: number
  /**
   * The height of the block where the given spec version was first introduced.
   */
  blockNumber: number
  /**
   * The hash of the block where the given spec version was first introduced.
   */
  blockHash: string
}

export interface SpecVersion extends SpecVersionRecord {
  /**
   * Chain metadata for this version of spec
   */
  metadata: string
}

export const getMetadata = (versionsFileName: string, specId: string): Metadata => {
  const filePath = path.join(__dirname, '..', versionsFileName)
  const versions = readJsonLines(filePath)

  const specVersion = parseInt(specId.split('@')[1])
  if (isNaN(specVersion)) throw new Error('Could not decode spec version')

  const version = versions.find(ver => ver.specVersion === specVersion)
  if (version === undefined) {
    throw new Error(
      `Metadata version not found for specVersion=${specVersion} in ${versionsFileName}. 
      Please update the metadata files.`
    )
  }

  const meta = decodeMetadata(version.metadata)
  return meta
}

function readJsonLines(file: string): SpecVersion[] {
  const result: SpecVersion[] = []
  for (const line of readLines(file)) {
    let json: any
    try {
      json = JSON.parse(line)
    } catch (e: any) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      throw new Error(`Failed to parse record #${result.length + 1} of ${file}: ${e.message}`)
    }

    result.push(json)
  }
  return result
}
