import { ProcessorConfig } from './types/custom/processorConfig'

export const testnetConfig: ProcessorConfig = {
    chainName: 'avn',
    prefix: 65,
    dataSource: {
        archive: 'http://localhost:8888/graphql',
        chain: 'wss://avn.test.aventus.io',
    },
    typesBundle: 'avn-types',
    batchSize: 100,
    // blockRange: {
    //     from: 7567700,
    // },
}

export const parachainConfig: ProcessorConfig = {
    // eslint-disable-next-line sonarjs/no-duplicate-string
    chainName: 'avn-parachain',
    prefix: 65,
    dataSource: {
        archive: 'http://localhost:8888/graphql',
        chain: 'wss://avn-parachain.dev.aventus.io',
    },
    typesBundle: 'avn-parachain',
    batchSize: 100,
    // blockRange: {
    //     from: 7567700,
    // },
}
