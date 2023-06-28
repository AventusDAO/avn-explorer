import { config } from '../config'
import { EsResponse } from '../types'

/**
 * Returns new data for ElasticSearch response sanitized from metadata that is not useful for the client
 * @param {EsResponse<D>} response data to sanitize
 * @returns {EsResponse<D>} cloned and sanitized data
 */
export function sanitizeElasticSearchResponse<D>(data: EsResponse<D>): EsResponse<D> {
  // remove `_shards` from response
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _shards, ...rest } = data
  // replace index names for transactions and blocks
  let json = JSON.stringify(rest)
  /*
   * not the safest thing to do as there may be a text in the json with this exact term (however it's very unlikely).
   * search, tx, blocks endpoints just forward ES response to the frontend (initially the server was set up very quickly to hide ES behind a firewall)
   * I plan to completely let go of this data format, adapt UI to the new responses, then we can get rid if it
   */
  json = json.replaceAll(`"_index":"${config.db.blocksIndex}"`, `"_index":"blocks"`)
  json = json.replaceAll(`"_index":"${config.db.extrinsicsIndex}"`, `"_index":"transactions"`)
  const sanitized = JSON.parse(json)
  return sanitized
}
