import { config } from './config'
import { getLogger } from './utils/logger'

import express, { NextFunction, Request, Response } from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import cors from 'cors'

// import routes / handlers
import status from './routes/status'
import { errorHandler } from './utils/error-handler'
import { BaseError } from './utils'

const logger = getLogger('statusApp')

const statusApp = express()

// adding Helmet to enhance API's security
statusApp.use(helmet())
// parse JSON bodies
statusApp.use(express.json({ limit: '5mb' }))
// parse URL-encoded bodies
statusApp.use(express.urlencoded({ extended: true }))
// adding morgan to log HTTP requests
statusApp.use(morgan(config.logging.morganRequestsFormat))

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
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      new BaseError('cors_not_allowed', 401, `Not allowed by CORS. Origin:  ${origin}`, true)
    )
  }
}
statusApp.use(cors(corsOptions))

// setup route handlers
statusApp.use('/status', status)

// setup error handler
// statusApp.use(errorHandler)
statusApp.use(
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  async (err: Error, req: Request, res: Response, next: NextFunction) => {
    return await errorHandler(err, req, res, next)
  }
)

export default statusApp
