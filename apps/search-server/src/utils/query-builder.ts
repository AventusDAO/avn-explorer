import { JsonMap } from '../types'

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
