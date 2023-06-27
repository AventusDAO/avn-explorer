import { AnyJson, EsQuery, JsonMap } from '../../types'

export interface ExtrinsicDataQuery {
  section?: string
  method?: string
  blockHeightFrom?: number
  blockHeightTo?: number
  timestampStart?: number
  timestampEnd?: number
}

/**
 * Gets query for searching across ES for given address
 * @param {string} value the address to search for
 * @returns {EsQuery} query object for ElasticSearch
 */
const getTransactionsForAddressQuery = (value: string): EsQuery => ({
  multi_match: {
    query: value,
    fields: ['proxy.signer', 'proxy.relayer']
  }
})

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

export const timestampRangeSubQuery = (minTimestamp: number): EsQuery => ({
  range: { timestamp: { gte: minTimestamp } }
})

export const isFailedSubQuery = (isFailed: boolean): EsQuery => ({
  match: { isSuccess: !isFailed }
})

export const systemOnlyQuery = (): EsQuery => ({
  match: { isSigned: false }
})

interface BlockRangeQuery extends JsonMap {
  range: {
    blockHeight: {
      gte: number | null
      lte: number | null
    }
  }
}

const blockHeightRangeFilterSubQuery = (
  blockHeightFrom?: number,
  blockHeightTo?: number
): BlockRangeQuery | undefined => {
  if (!blockHeightFrom && !blockHeightTo) return undefined
  const rangeQuery: BlockRangeQuery = {
    range: {
      blockHeight: {
        gte: null,
        lte: null
      }
    }
  }
  if (blockHeightFrom) rangeQuery.range.blockHeight.gte = blockHeightFrom ?? null
  if (blockHeightTo) rangeQuery.range.blockHeight.lte = blockHeightTo ?? null
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
  const { section, method, blockHeightFrom, blockHeightTo, timestampStart, timestampEnd } =
    dataQuery
  if (section) matches.push({ match: { section } })
  if (method) matches.push({ match: { method } })
  const blockRangeQuery = blockHeightRangeFilterSubQuery(blockHeightFrom, blockHeightTo)
  if (blockRangeQuery) matches.push(blockRangeQuery)
  const timestampQuery = extrinsicTimestampRangeFilterSubQuery(timestampStart, timestampEnd)
  if (timestampQuery) matches.push(timestampQuery)
  return matches
}

/**
 * Gets query for fetching transfer extrinsics within given timestamp range
 * @param {number} minTimestamp optional min timestamp of the extrinsic
 * @param {boolean} isFailed optional whether to query failed extrinsic
 * @returns {EsQuery} query object for ElasticSearch
 */
export const getExtrinsicsQuery = (
  minTimestamp?: number,
  isFailed?: boolean,
  systemOnly?: boolean,
  dataQuery?: ExtrinsicDataQuery
): EsQuery => {
  const mustItems: JsonMap[] = []
  if (minTimestamp) mustItems.push(timestampRangeSubQuery(minTimestamp))
  if (dataQuery) mustItems.push(...extrinsicDataQuery(dataQuery))

  const filters: AnyJson[] = []
  if (isFailed !== undefined) filters.push(isFailedSubQuery(isFailed))
  if (systemOnly) filters.push(systemOnlyQuery())
  return {
    bool: {
      must: mustItems,
      filter: filters
    }
  }
}
