import { ChainGen, getEnvironment } from '@avn/config'
import { createLogger } from '@subsquid/logger'
const log = createLogger('sqd:processor')

const environment = getEnvironment()
if (environment.chainGen === ChainGen.parachain) {
  log.info('starting parachain processor')
  require('./processors/parachain-processor')
} else {
  log.info('starting solochain processor')
  require('./processors/solochain-processor')
}
