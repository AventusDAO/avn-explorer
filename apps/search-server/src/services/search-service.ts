import { config } from '../config'
import { AxiosError } from 'axios'
import { getLogger } from '../utils/logger'
import {
  EsQuery,
  EsRequestPayload,
  EsResponse,
  EsSearchFields,
  EsSortDirection,
  EsSortItem,
  JsonMap
} from '../types'
import { ApiError, avnHashRegex, isAxiosError } from '../utils'
import { sanitizeElasticSearchResponse } from '../utils/sanitizer'
import { elasticSearch } from './elastic-search'
import { encodeAccountHex } from './user-service'

const logger = getLogger('search-controller')

const defaultSort: EsSortItem = { timestamp: EsSortDirection.Desc }

/**
 * Predefined search fields used for search so far
 */
const searchFields: Record<string, EsSearchFields> = {
  address: ['transaction.to', 'transaction.from', 'events.__dataSearch'],
  hash: ['hash', 'rootHash', 'events.__dataSearch']
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const processError = (err: any): Error => {
  if (isAxiosError(err)) {
    const axiosError = err as AxiosError
    logger.error(`Failed to search. DB response: ${JSON.stringify(axiosError.response?.data)}`)
    // database (ES) rejected our request, even code could be 400, to external client should be 500
    return ApiError.fromAxios(axiosError, 500, 'Internal Server Error')
  }
  return err
}

export const searchForHexAddress = async (value: string) => {
  const isHash = avnHashRegex.test(value)

  if (isHash) return await searchForHash(value)
}

export const searchForHash = async (value: string): Promise<EsResponse<JsonMap>> => {
  const size = 1
  // note: user can enter decoded `0x...` value or the encoded ss58 string representation but in ES the address in in ss58 string rep
  // - if `value` is in hex, `ss58Value` is in ss58
  // - if `value` is in ss58, `ss58Value` still will be in ss58
  const ss58Value = encodeAccountHex(value)
  const query = getMultiSearchHashQuery([value, ss58Value])
  const payload: EsRequestPayload = { size, query, sort: [defaultSort] }
  const path = `${config.db.blocksIndex},${config.db.extrinsicsIndex}/_search`

  try {
    const response = await elasticSearch.post<JsonMap>(path, payload)
    const data = sanitizeElasticSearchResponse(response.data)
    const hits = data.hits.hits
    // note: replace `ss58Value` with the search value to return to user values that are in the same format he used in search
    const jsonHits = JSON.stringify(hits)
    data.hits.hits = JSON.parse(jsonHits.replaceAll(ss58Value, value))
    return data as EsResponse<JsonMap>
  } catch (err) {
    throw processError(err)
  }
}

/**
 * Gets query for searching for given hash
 * @param {string} value the hash to search for
 * @returns {EsQuery} query object for ElasticSearch
 */
export const getHashSearchQuery = (value: string): EsQuery => ({
  multi_match: {
    query: value,
    fields: searchFields.hash
  }
})

export const getMultiSearchHashQuery = (values: string[]): EsQuery => ({
  bool: {
    should: values.map(value => getHashSearchQuery(value))
  }
})
