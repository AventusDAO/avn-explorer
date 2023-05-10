import { config } from './config'
import Version from './version.json'
import { getLogger } from './utils/logger'

import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import cors from 'cors'

import statusApp from './status-app'
import blocks from './routes/blocks'
import extrinsics from './routes/extrinsics'

import { BaseError } from './utils'

const logger = getLogger('app')
const app = express()

logger.info(`app version: ${JSON.stringify(Version, null, 2)}`)
logger.info(`configuration: ${JSON.stringify(config, null, 2)}`)

// adding Helmet to enhance API's security
app.use(helmet())
// parse JSON bodies
app.use(express.json())
// parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }))
// adding morgan to log HTTP requests
app.use(morgan(config.logging.morganRequestsFormat))

// enabling CORS for requests made from the specified allowed URLs
const originsList = config.server.corsAllowedUrls
if (!originsList)
  logger.warn('List of list of cors origins is undefined. CORS is disabled for all origins')
const corsOptions = {
  origin: (origin: any, callback: any) => {
    if (originsList) {
      const whitelist = originsList.split(',,,')
      // if origin is on the allowed list let it go through
      if (!origin || whitelist.includes(origin)) {
        callback(null, true)
        return
      }
    }
    // else block CORS access
    callback(
      new BaseError('cors_not_allowed', 401, `Not allowed by CORS. Origin:  ${origin}`, true)
    )
  }
}
app.use(cors(corsOptions))

// add routes
app.use('/blocks', blocks)
app.use('/extrinsics', extrinsics)

const port = config.server.port
app.listen(port)

logger.info(`server is listening on ${port}`)

statusApp.listen(config.server.statusPort)
logger.info(`health status server is listening on ${config.server.statusPort}`)
