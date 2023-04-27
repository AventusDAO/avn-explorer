import { blocksSchema, extrinsicsSchema, eventsSchema } from './schema'
import { IndexMapping, MappingsResponse } from './types'
import { get, put } from './utils'

export interface EsOptions {
  baseUrl: string
  blocksIndex: string
  extrinsicsIndex: string
  eventsIndex: string
}

export class ElasticSearch {
  baseUrl: string
  blocksIndex: string
  extrinsicsIndex: string
  eventsIndex: string
  constructor({ baseUrl, blocksIndex, extrinsicsIndex, eventsIndex }: EsOptions) {
    this.baseUrl = baseUrl
    this.blocksIndex = blocksIndex
    this.extrinsicsIndex = extrinsicsIndex
    this.eventsIndex = eventsIndex
  }

  /**
   * Creates indexes and sets their mappings *explicitly* based on json files.
   * This function will throw if called and indexes are already created.
   *
   * NOTE: there's no way to re-do mapping once indexes.
   * If mappings require to be changed one needs to drop and index and create a new one
   * @returns {array} array of ES operation result
   */
  async setupIndexes(): Promise<void> {
    const responses = await Promise.all([
      put(`${this.baseUrl}/${this.blocksIndex}`, blocksSchema),
      put(`${this.baseUrl}/${this.extrinsicsIndex}`, extrinsicsSchema),
      put(`${this.baseUrl}/${this.eventsIndex}`, eventsSchema)
    ])
    const errorResponses = responses.filter(res => res.error !== undefined || res.status >= 400)
    if (errorResponses.length > 0) {
      throw new Error(
        `Could not create ElasticSearch index mappings. \nErrors: ${JSON.stringify(
          errorResponses.map(res => res)
        )}`
      )
    }
  }

  /**
   * Check if ElasticSearch has set up indexes.
   * WARNING: it does not check whether the mappings are up to date
   * @returns {Promise<boolean>} whether the blocks and extrinsics indexes have been created
   */
  async isSetUp(): Promise<boolean> {
    const url = `${this.baseUrl}/_mappings`
    const res: MappingsResponse = await get(url)
    const blocks = res[this.blocksIndex]
    const extrinsics = res[this.extrinsicsIndex]
    const events = res[this.eventsIndex]

    const isIndexSetup = (indexResponse: IndexMapping): boolean =>
      indexResponse?.mappings !== undefined

    const isElasticSearchSetup =
      isIndexSetup(blocks) && isIndexSetup(extrinsics) && isIndexSetup(events)

    return isElasticSearchSetup
  }
}
