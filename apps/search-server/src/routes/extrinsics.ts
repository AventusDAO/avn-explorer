import { Router } from 'express'
import { getExtrinsics } from '../services/extrinsics'
import { asyncCatch, processIntegerParam, processStringParam } from '../utils'

const router = Router()

router.get(
  '/',
  // note: adding "no-misused-promises" until we can upgrade to Express v5 for async functions as middleware and handlers
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  asyncCatch(async (req, res, _next) => {
    const size = processIntegerParam(req.query.size, 'size')
    const from = processIntegerParam(req.query.from, 'from')
    const sort = processStringParam(req.query.sort, 'sort')
    const address = processStringParam(req.query.address, 'address')
    const section = processStringParam(req.query.section, 'section')
    const method = processStringParam(req.query.method, 'method')
    const blockHeightFrom = processIntegerParam(req.query.blockHeightFrom, 'blockHeightFrom')
    const blockHeightTo = processIntegerParam(req.query.blockHeightTo, 'blockHeightTo')
    const timestampStart = processIntegerParam(req.query.timestampStart, 'timestampStart')
    const timestampEnd = processIntegerParam(req.query.timestampEnd, 'timestampEnd')

    const data = await getExtrinsics(size, from, sort, address, undefined, {
      section,
      method,
      blockHeightFrom,
      blockHeightTo,
      timestampStart,
      timestampEnd
    })

    res.status(200).json({
      data
    })
  })
)

export default router
