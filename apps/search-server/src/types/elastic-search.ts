import { JsonMap } from './json'

export type EsQuery = JsonMap
export type EsAggregation = JsonMap

export type EsSortScriptItem = {
  _script: {
    type: string
    script: {
      lang: string
      source: string
    }
    order: EsSortDirection
  }
}
export type EsSortItem = Record<string, EsSortDirection> | EsSortScriptItem
export enum EsSortDirection {
  Asc = 'ASC',
  Desc = 'DESC'
}

export interface EsRequestPayload {
  size?: number
  from?: number
  sort?: EsSortItem[]
  query?: EsQuery
  aggs?: EsAggregation
}

export interface EsResponse<DataType> {
  took: number
  timed_out: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  _shards?: any
  hits: {
    total: {
      value: number
      relation: string
    }
    max_score: 0
    hits: Array<{
      _index: string
      _type: string
      _id: string
      _score: number
      _source: DataType
    }>
  }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  aggregations?: any
}
