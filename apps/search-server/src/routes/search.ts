import { Router } from 'express'
import { asyncCatch, requireStringParam } from '../utils'
import { searchForHash } from '../services/search-service'

const router = Router()
router.get(
  '/',
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  asyncCatch(async (req, res, _next) => {
    const q = requireStringParam(req.query.q, 'q')

    const data = await searchForHash(q)
    res.status(200).json({
      data
    })
  })
)

export default router
