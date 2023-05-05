import { AxiosError } from 'axios'
import { ApiError, isAxiosError, sanitizeElasticSearchResponse } from '../utils'
import {
  JsonMap,
  EsSortItem,
  EsRequestPayload,
  EsSortDirection,
  EsResponse,
  EsQuery
} from '../types'
import { getLogger } from '../utils/logger'
import { config } from '../config'
import { processSortParam } from '../utils/paramHelpers'
import { elasticSearch } from './elastic-search'
const logger = getLogger('blocks-controller')

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const processError = (err: any): Error => {
  if (isAxiosError(err)) {
    const axiosError = err as AxiosError
    logger.error(
      `Failed to fetch blocks. DB response: ${JSON.stringify(axiosError.response?.data)}`
    )
    // database (ES) rejected our request, even code could be 400, to external client should be 500
    return ApiError.fromAxios(axiosError, 500, 'Internal Server Error')
  }
  return err
}

interface EsBlocksQuery extends EsQuery {
  bool: {
    must?: JsonMap | JsonMap[]
    must_not?: JsonMap | JsonMap[]
    should?: JsonMap | JsonMap[]
    minimum_should_match?: number
  }
}

export const timestampRangeSubQuery = (minTimestamp: number): EsQuery => ({
  range: { timestamp: { gte: minTimestamp } }
})

/**
 * Gets query for fetching blocks within given timestamp range
 * @param {number} minTimestamp optional min timestamp of the block
 * @param {boolean} withSystemBlocks whether to include blocks that contain system extrinsics only (with 0 AVT block rewards)
 * @returns {EsQuery} query object for ElasticSearch
 */
const getBlocksQuery = (minTimestamp?: number, withSystemBlocks = true): EsQuery => {
  const query: EsBlocksQuery = {
    bool: {}
  }
  if (minTimestamp !== undefined) {
    query.bool.must = timestampRangeSubQuery(minTimestamp)
  }
  if (!withSystemBlocks) {
    // NOTE: using `noSignedTransactions > 0` instead of using the "estimated reward" is more appropriate,
    // but this property was added after initial launch, so not all of the blocks contain it.
    // To avoid data reindexing and migration we're fetching rewardToken > 0 OR noSignedTransactions >= 1.
    query.bool.minimum_should_match = 1
    query.bool.should = [
      {
        range: { rewardToken: { gt: 0 } }
      },
      {
        range: { noSignedTransactions: { gte: 1 } }
      }
    ]
  }
  return query
}

export const getBlocks = async (
  size = 50,
  from = 0,
  skipSystemBlocks = false,
  sortCsv?: string
): Promise<EsResponse<JsonMap>> => {
  const query = getBlocksQuery(undefined, !skipSystemBlocks)
  const sort: EsSortItem[] = []

  const defaultSort: EsSortItem = { number: EsSortDirection.Desc }

  if (sortCsv !== undefined) {
    // throws ApiError (400) if `sort` is not supported
    const supportedSortFields = ['timestamp', 'height']
    const sortItem = processSortParam(sortCsv, supportedSortFields)

    if (sortItem.number) {
      // if sorting by blockNumber.Asc then also sort by chainType .Asc here
      const chainTypeSortDirection: EsSortDirection = sortItem.number
      const chainTypeSort = processSortParam(`chainType,${chainTypeSortDirection}`, ['chainType'])
      sort.push(chainTypeSort)
    }

    sort.push(sortItem)
    if (!Object.keys(sortItem).includes('number')) {
      sort.push(defaultSort)
    }
  } else {
    sort.push(defaultSort)
  }

  const payload: EsRequestPayload = { size, from, sort, query }
  try {
    const response = await elasticSearch.post<JsonMap>(`${config.db.blocksIndex}/_search`, payload)
    const data = sanitizeElasticSearchResponse<JsonMap>(response.data)
    return data
  } catch (err) {
    throw processError(err)
  }
}
