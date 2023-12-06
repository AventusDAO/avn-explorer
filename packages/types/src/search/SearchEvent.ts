import { EsItem } from './common'

// NOTE: keep it in sync with the ES schema
export interface SearchEvent extends EsItem {
  blockHeight: number
  section: string
  name: string
  /**
   * Values of event.args normalized (recursively mapped) into a string array.
   * This data structure enables ElasticSearch to be index the values and make them searchable
   * (because the original `args` is an array of Array<string | object | number> which is not supported by ES)
   */
  __argValues?: string[]
}
