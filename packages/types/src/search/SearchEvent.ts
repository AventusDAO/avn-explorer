import { EsItem } from './common'

// NOTE: keep it in sync with the ES schema
export interface SearchEvent extends EsItem {
  blockHeight: number
  section: string
  name: string
  /// values of event.args normalized into a string array
  __argValues?: string[]
}
