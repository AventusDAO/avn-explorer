import { Request, Response, NextFunction, RequestHandler } from 'express'

/**
 * Wraps a function in default catch handler
 * @param {RequestHandler} fn the RequestHandler function
 * Usage:
 * export const getUsers: RequestHandler = asyncCatch(async (req, res, next) => {
 *    // request handler code
 * })
 */
export const asyncCatch =
  (fn: RequestHandler) =>
  // note: adding "no-misused-promises" until we can upgrade to Express v5 for async functions as middleware and handlers
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // eslint-disable-next-line @typescript-eslint/return-await
      return await fn(req, res, next)
    } catch (error) {
      next(error)
    }
  }
