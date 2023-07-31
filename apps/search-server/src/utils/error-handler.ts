import { NextFunction, Request, Response } from 'express'
import { BaseError } from './errors'
import { getLogger } from '../utils/logger'
const logger = getLogger('error-handler')

const isProduction = process.env.NODE_ENV === 'production'

class ErrorHandler {
  public async handleError(err: Error): Promise<void> {
    const errMsg = err.stack && !this.isTrustedError(err) ? err.stack : `${JSON.stringify(err)}`
    logger.error(errMsg)
    // ... can do other stuff, e.g. send mail or Slack notification
    return await Promise.resolve()
  }

  public isTrustedError(error: Error): boolean {
    if (error instanceof BaseError) {
      return error.isOperational
    }
    return false
  }
}

const handler = new ErrorHandler()

export async function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  // handle error, e.g. log or send alerts
  await handler.handleError(err)

  // get the response json
  let status = err instanceof BaseError ? err.httpCode : 500
  const response = {
    status,
    error: {
      name: err.name,
      message: err.message,
      stack: err.stack
    }
  }
  if (isProduction) {
    response.error.stack = undefined
    if (!handler.isTrustedError(err)) {
      // if it is not an operational error just display generic Server Error data
      status = 500
      response.status = status
      response.error.message = 'Internal Server Error'
    }
  }

  // if already for some reason server started sending response
  if (res.headersSent) {
    logger.error(
      `App has started already sending a response (not here) while handling an error. Make sure server is not responding while creating an error response...`
    )
    // throw for dev
    if (!isProduction) throw err
    // for prod forward it to default express handler to close the connection
    return next(err)
  }

  // send the error data
  res.status(status).json(response)
}

// get the unhandled Promise rejection and throw it (to the `uncaughtException` listener)
process.on('unhandledRejection', (reason: Error, _promise: Promise<unknown>) => {
  reason.name = `UnhandledPromiseRejectionWarning: ${reason.name}`
  throw reason
})

// handle uncaught exceptions
// note: adding "no-misused-promises" until we can upgrade to Express v5 for async functions as middleware and handlers
// eslint-disable-next-line @typescript-eslint/no-misused-promises
process.on('uncaughtException', async (error: Error) => {
  await handler.handleError(error)
  // exit app if error is not trusted (i.e. not operational) shut down the app
  if (!handler.isTrustedError(error)) {
    logger.error(
      `Shutting down... because an unhandled rejection or an uncaught non-trusted error. ~ Spawn me fresh ~`
    )
    process.exit(1)
  } else {
    // do nothing - let the request (that caused unhandledRejection / the error) timeout as usual / default express config
  }
})
