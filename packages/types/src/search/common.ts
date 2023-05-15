export enum ChainGen {
  solochain = 0,
  parachain = 1
}

export interface EsItem {
  refId: string
  timestamp: number
  chainGen: ChainGen
}
