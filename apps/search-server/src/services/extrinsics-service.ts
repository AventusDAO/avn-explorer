import { AxiosError } from 'axios'
import { ApiError, avnHashRegex, isAxiosError } from '../utils'
import {
  JsonMap,
  EsSortItem,
  EsRequestPayload,
  EsSortDirection,
  EsQuery,
  Extrinsic,
  AnyJson
} from '../types'
import { getLogger } from '../utils/logger'
import { config } from '../config'
import { processSortParam } from '../utils/paramHelpers'
import { elasticSearch } from './elastic-search'
import { decodeAccountToHex, encodeAccountHex } from './user-service'
const logger = getLogger('extrinsics-service')

const supportedSortFields = ['timestamp', 'blockNumber']
const defaultSort: EsSortItem = { timestamp: EsSortDirection.Desc }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const processError = (err: any): Error => {
  if (isAxiosError(err)) {
    const axiosError = err as AxiosError
    logger.error(
      `Failed to fetch data from ElasticSearch.\n${JSON.stringify(axiosError.response?.data)}`
    )
    // database (ES) rejected our request, even code could be 400, to external client should be 500
    return ApiError.fromAxios(axiosError, 500, 'Internal Server Error')
  }
  return err
}

interface ExtrinsicDataQuery {
  section?: string
  method?: string
  blockNumberFrom?: number
  blockNumberTo?: number
  timestampStart?: number
  timestampEnd?: number
}

/**
 * Predefined search fields used for search so far
 */
const searchFields: Record<string, string[]> = {
  address: ['proxy.signer', 'proxy.relayer']
}

/**
 * Gets query for searching for multiple values at the same time
 * @param {string} values values to search for
 * @returns {EsQuery} query object for ElasticSearch
 */
export const getMultiTransactionsForAddressQuery = (values: string[]): EsQuery => ({
  bool: {
    should: values.map(value => getTransactionsForAddressQuery(value))
  }
})

/**
 * Gets query for searching across ES for given address
 * @param {string} value the address to search for
 * @returns {EsQuery} query object for ElasticSearch
 */
const getTransactionsForAddressQuery = (value: string): EsQuery => ({
  multi_match: {
    query: value,
    fields: searchFields.address
  }
})

export const timestampRangeSubQuery = (minTimestamp: number): EsQuery => ({
  range: { timestamp: { gte: minTimestamp } }
})

export const isFailedSubQuery = (isFailed: boolean): EsQuery => ({
  match: { isSuccess: !isFailed }
})

interface BlockRangeQuery extends JsonMap {
  range: {
    blockNumber: {
      gte: number | null
      lte: number | null
    }
  }
}

const extrinsicsBlockNumberRangeFilterSubQuery = (
  blockNumberFrom?: number,
  blockNumberTo?: number
): BlockRangeQuery | undefined => {
  if (!blockNumberFrom && !blockNumberTo) return undefined
  const rangeQuery: BlockRangeQuery = {
    range: {
      blockNumber: {
        gte: null,
        lte: null
      }
    }
  }
  if (blockNumberFrom) rangeQuery.range.blockNumber.gte = blockNumberFrom ?? null
  if (blockNumberTo) rangeQuery.range.blockNumber.lte = blockNumberTo ?? null
  return rangeQuery
}

interface TimestampQuery extends JsonMap {
  range: {
    timestamp: {
      gte: number | null
      lte: number | null
      format: 'epoch_millis'
    }
  }
}
const extrinsicTimestampRangeFilterSubQuery = (
  timestampStart?: number,
  timestampEnd?: number
): TimestampQuery | undefined => {
  if (!timestampStart && !timestampEnd) return undefined
  const rangeQuery: TimestampQuery = {
    range: {
      timestamp: {
        gte: null,
        lte: null,
        format: 'epoch_millis'
      }
    }
  }
  if (timestampStart) rangeQuery.range.timestamp.gte = timestampStart
  if (timestampEnd) rangeQuery.range.timestamp.lte = timestampEnd
  return rangeQuery
}

const extrinsicDataQuery = (dataQuery: ExtrinsicDataQuery): JsonMap[] => {
  const matches: JsonMap[] = []
  const { section, method, blockNumberFrom, blockNumberTo, timestampStart, timestampEnd } =
    dataQuery
  if (section) matches.push({ match: { section } })
  if (method) matches.push({ match: { method } })
  const blockRangeQuery = extrinsicsBlockNumberRangeFilterSubQuery(blockNumberFrom, blockNumberTo)
  if (blockRangeQuery) matches.push(blockRangeQuery)
  const timestampQuery = extrinsicTimestampRangeFilterSubQuery(timestampStart, timestampEnd)
  if (timestampQuery) matches.push(timestampQuery)
  return matches
}

/**
 * Gets query for fetching transfer transactions within given timestamp range
 * @param {number} minTimestamp optional min timestamp of the transaction
 * @param {boolean} isFailed optional whether to query failed transactions
 * @returns {EsQuery} query object for ElasticSearch
 */
export const getTransactionsQuery = (
  minTimestamp?: number,
  isFailed?: boolean,
  dataQuery?: ExtrinsicDataQuery
): EsQuery => {
  const mustItems: JsonMap[] = []
  if (minTimestamp) mustItems.push(timestampRangeSubQuery(minTimestamp))
  if (dataQuery) mustItems.push(...extrinsicDataQuery(dataQuery))

  const filters: AnyJson[] = []
  if (isFailed !== undefined) filters.push(isFailedSubQuery(isFailed))

  console.log(filters)
  return {
    bool: {
      must: mustItems,
      filter: filters
    }
  }
}

export const getExtrinsics = async (
  size = 50,
  from = 0,
  sortCsv?: string,
  address?: string,
  isFailed?: boolean,
  dataQuery?: ExtrinsicDataQuery
): Promise<Extrinsic[]> => {
  let query: EsQuery
  let isHexAddress = false
  let ss58Value: string | undefined
  if (address) {
    // note: user address may be entered as hex decoded `0x...` value or the encoded ss58 representation
    isHexAddress = avnHashRegex.test(address)
    if (isHexAddress) {
      ss58Value = encodeAccountHex(address)
      query = getMultiTransactionsForAddressQuery([ss58Value, address])
    } else {
      const hexValue = decodeAccountToHex(address)
      // we do this here because we know this will generate avn prefixed addresses
      const avnPrefixedSS58Address = encodeAccountHex(hexValue)

      if (avnPrefixedSS58Address === address) {
        query = getMultiTransactionsForAddressQuery([address, hexValue])
      } else {
        // this means we are searching using a non-avn prefixed address, so search with all 3 values.
        query = getMultiTransactionsForAddressQuery([avnPrefixedSS58Address, address, hexValue])
      }
    }
  } else {
    query = getTransactionsQuery(undefined, isFailed, dataQuery)
  }

  const sort: EsSortItem[] = []
  if (sortCsv !== undefined) {
    const sortItem = processSortParam(sortCsv, supportedSortFields) // throws ApiError (400) if sort is not supported
    sort.push(sortItem)
  }
  sort.push(defaultSort)

  const payload: EsRequestPayload = { size, from, sort, query }
  try {
    const response = await elasticSearch.post<JsonMap>(
      `${config.db.extrinsicsIndex}/_search`,
      payload
    )

    let data = response.data.hits.hits.map(hit => hit._source)

    if (isHexAddress && ss58Value && address) {
      // note: replace `ss58Value` with the search value to return to user values that are in the same format he used in search
      const jsonData = JSON.stringify(data)
      data = JSON.parse(jsonData.replaceAll(ss58Value, address))
    }
    return data
  } catch (err) {
    throw processError(err)
  }
}
