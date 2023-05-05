import { Router } from 'express'
import { getBlocks } from '../services/blocks-service'
import { Block, DataResponse } from '../types'
import { asyncCatch, processBooleanParam, processIntegerParam, processStringParam } from '../utils'
const router = Router()

router.get(
  '/',
  // note: adding "no-misused-promises" until we can upgrade to Express v5 for async functions as middleware and handlers
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  asyncCatch(async (req, res, _next) => {
    const size = processIntegerParam(req.query.size, 'size')
    const from = processIntegerParam(req.query.from, 'from')
    const sort = processStringParam(req.query.sort, 'sort')
    const skipSystemBlocks = processBooleanParam(req.query.skipSystemBlocks, 'skipSystemBlocks')
    const data = await getBlocks(size, from, skipSystemBlocks, sort)
    const response: DataResponse<Block[]> = {
      data
    }
    res.status(200).json(response)
  })
)

export default router
