import { environment } from '@avn/config'
import { createLogger } from '@subsquid/logger'
const log = createLogger('sqd:processor')

if (environment.name.includes('parachain')) {
  log.info('starting parachain processor')
  require('./processors/parachain-processor')
} else {
  log.info('starting solochain processor')
  require('./processors/solochain-processor')
}
