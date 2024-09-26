import { EsItem } from './common'
import { SearchBlock } from './SearchBlock'
import { SearchEvent } from './SearchEvent'
import { SearchExtrinsic } from './SearchExtrinsic'

interface ISearchResultItem extends EsItem {
  type: 'block' | 'extrinsic' | 'event' | 'address'
}

interface SearchAddress {
  publicKey: string
}

export interface SearchResultBlock extends ISearchResultItem, SearchBlock {}
export interface SearchResultExtrinsic extends ISearchResultItem, SearchExtrinsic {}
export interface SearchResultAddress extends SearchAddress {
  type: 'address'
}
