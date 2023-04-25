export enum ChainGen {
  solochain = 0,
  parachain = 1
}

export interface ChainSpec {
  specName: string
  specVersion: number
}

export const getChainGen = (spec: ChainSpec): ChainGen => {
  if (spec.specName === 'avn-parachain' || spec.specName.includes('parachain')) {
    return ChainGen.parachain
  } else {
    return ChainGen.solochain
  }
}
