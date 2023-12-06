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
import { SearchResultBlock, SearchResultExtrinsic } from '@avn/types/src/search'
import { getMultiSearchQuery } from '../utils/query-builder'

const logger = getLogger('search-controller')

const defaultSort: EsSortItem = { timestamp: EsSortDirection.Desc }

/**
 * Predefined search fields used for search so far
 */
const searchFields: Record<string, EsSearchFields> = {
  hash: ['hash']
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

export const searchForHash = async (
  value: string
): Promise<Array<SearchResultBlock | SearchResultExtrinsic>> => {
  const size = 1
  const query = getMultiSearchHashQuery([value])
  const payload: EsRequestPayload = { size, query, sort: [defaultSort] }
  const path = `${config.db.blocksIndex},${config.db.extrinsicsIndex}/_search`

  try {
    const { data } = await elasticSearch.post<JsonMap>(path, payload)
    const items = data.hits.hits.map(hit => {
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
    return items
  } catch (err) {
    throw processError(err)
  }
}

const getMultiSearchHashQuery = (values: string[]): EsQuery =>
  getMultiSearchQuery(values, searchFields.hash, 'should')
