import { EsQuery, JsonMap } from '../types'

interface NumberRangeQuery extends JsonMap {
  range: Record<
    string,
    {
      gte: number | null
      lte: number | null
    }
  >
}

export const numberRangeFilterSubQuery = (
  paramName: string,
  from?: number,
  to?: number
): NumberRangeQuery | undefined => {
  if (!from && !to) return undefined
  const rangeQuery: NumberRangeQuery = {
    range: {
      [paramName]: {
        gte: null,
        lte: null
      }
    }
  }
  if (from) rangeQuery.range[paramName].gte = from ?? null
  if (to) rangeQuery.range[paramName].lte = to ?? null
  return rangeQuery
}

interface TimestampQuery extends JsonMap {
  range: Record<
    string,
    {
      gte: number | null
      lte: number | null
      format: 'epoch_millis'
    }
  >
}

export const timestampRangeFilterSubQuery = (
  paramName: string,
  start?: number,
  end?: number
): TimestampQuery | undefined => {
  if (!start && !end) return undefined
  const rangeQuery: TimestampQuery = {
    range: {
      [paramName]: {
        gte: null,
        lte: null,
        format: 'epoch_millis'
      }
    }
  }
  if (start) rangeQuery.range[paramName].gte = start
  if (end) rangeQuery.range[paramName].lte = end
  return rangeQuery
}

/**
 * Gets query for searching for multiple values in multiple fields at the same time
 * @param {string} values values to search for
 * @param {string[]} fields fields to search in
 * @param {'should' | 'must'} operator the operator, 'should' will return results that match any of the values, 'must' will return results that match all of the values
 * @returns {EsQuery} query object for ElasticSearch
 */
export const getMultiSearchQuery = (
  values: string[],
  fields: string[],
  operator: 'should' | 'must' = 'should'
): EsQuery => ({
  bool: {
    [operator]: values.map(value => ({
      multi_match: {
        query: value,
        fields
      }
    }))
  }
})
