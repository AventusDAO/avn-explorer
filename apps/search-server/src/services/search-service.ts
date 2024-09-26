import { config } from '../config'
import { AxiosError } from 'axios'
import { getLogger } from '../utils/logger'
import {
  EsQuery,
  EsRequestPayload,
  EsSearchFields,
  EsSortDirection,
  EsSortItem,
  JsonMap,
  SearchBlock,
  SearchExtrinsic
} from '../types'
import { ApiError, avnHashRegex, isAxiosError } from '../utils'
import { elasticSearch } from './elastic-search'
import {
  SearchResultAddress,
  SearchResultBlock,
  SearchResultExtrinsic
} from '@avn/types/src/search'
import { getMultiSearchQuery } from '../utils/query-builder'
import { u8aToHex } from '@polkadot/util'
import { Keyring } from '@polkadot/api'

const logger = getLogger('search-controller')

const defaultSort: EsSortItem = { timestamp: EsSortDirection.Desc }

/**
 * Predefined search fields used for search so far
 */
const searchFields: Record<string, EsSearchFields> = {
  address: ['extrinsic.to', 'extrinsic.from', 'proxySigner', 'signer', 'relayer'],
  hash: ['hash']
}

/** keyring for avn account type */
const accountKeyring = new Keyring({ type: 'sr25519' })

/** gets hex pk for given ss58 address */
export function decodeAccountToHex(encodedAddress: string): string {
  return u8aToHex(accountKeyring.decodeAddress(encodedAddress))
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

async function performSearch(queryFunction: (value: string[]) => EsQuery, value: string[]) {
  const size = 1
  const query = queryFunction(value)
  const payload: EsRequestPayload = { size, query, sort: [defaultSort] }
  const path = `${config.db.blocksIndex},${config.db.extrinsicsIndex}/_search`

  const response = await elasticSearch.post<JsonMap>(path, payload)
  return response.data
}

export const searchForHash = async (
  value: string
): Promise<Array<SearchResultBlock | SearchResultExtrinsic | SearchResultAddress>> => {
  try {
    let data = await performSearch(getMultiSearchHashQuery, [value])
    let items = []
    if (!data.hits.hits.length) {
      data = await performSearch(getMultiSearchAddressQuery, [value])
      items = [{ type: 'address' as 'address', publicKey: value }]
    } else {
      items = data.hits.hits.map(hit => {
        const isBlock = hit._index === config.db.blocksIndex
        const isExtrinsic = hit._index === config.db.extrinsicsIndex
        if (isBlock) {
          return {
            type: 'block' as 'block',
            ...(hit._source as unknown as SearchBlock)
          }
        } else if (isExtrinsic) {
          return {
            type: 'extrinsic' as 'extrinsic',
            ...(hit._source as unknown as SearchExtrinsic)
          }
        } else throw new Error('Search item index not found')
      })
    }
    return items
  } catch (err) {
    throw processError(err)
  }
}

const getMultiSearchHashQuery = (values: string[]): EsQuery =>
  getMultiSearchQuery(values, searchFields.hash, 'should')

/**
 * Gets query for searching for multiple values at the same time
 * @param {string} values values to search for
 * @returns {EsQuery} query object for ElasticSearch
 */
export const getMultiSearchAddressQuery = (values: string[]): EsQuery => ({
  bool: {
    should: values.map(value => getAddressSearchQuery(value))
  }
})

/**
 * Gets query for searching across ES for given address
 * @param {string} value the address to search for
 * @returns {EsQuery} query object for ElasticSearch
 */
const getAddressSearchQuery = (value: string): EsQuery => ({
  multi_match: {
    query: value,
    fields: searchFields.address
  }
})
