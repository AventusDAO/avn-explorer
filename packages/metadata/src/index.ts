import { decodeMetadata, Metadata } from '@subsquid/substrate-metadata'
import { readLines } from '@subsquid/util-internal-read-lines'
import { AvnEnvironmentName } from '@avn/config'
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
const VersionsFileNames: Record<AvnEnvironmentName, string | undefined> = {
  'parachain-dev': 'versions-parachain.dev.jsonl',
  'parachain-testnet': 'versions-parachain.testnet.jsonl',
  'parachain-mainnet': 'versions-parachain.mainnet.jsonl',
  'solochain-dev': undefined,
  'solochain-testnet': undefined,
  'solochain-mainnet': undefined
}

export const getMetadata = (env: AvnEnvironmentName): Metadata => {
  const fileName = VersionsFileNames[env]
  if (!fileName) throw new Error(`Metadata for ${env} is not supported`)

  const filePath = path.join(__dirname, '..', fileName)
  const versions = readJsonLines(filePath)

  const meta = decodeMetadata(versions[0].metadata)
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
