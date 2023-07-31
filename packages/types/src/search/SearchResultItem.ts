import { EsItem } from './common'
import { SearchBlock } from './SearchBlock'
import { SearchEvent } from './SearchEvent'
import { SearchExtrinsic } from './SearchExtrinsic'

interface ISearchResultItem extends EsItem {
  type: 'block' | 'extrinsic' | 'event'
}

export interface SearchResultBlock extends ISearchResultItem, SearchBlock {}
export interface SearchResultExtrinsic extends ISearchResultItem, SearchExtrinsic {}
