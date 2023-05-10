import { Router } from 'express'
import { getAppStatus } from '../services/status-service'
import { asyncCatch } from '../utils'
const router = Router()

router.get(
  '/',
  // note: adding "no-misused-promises" until we can upgrade to Express v5 for async functions as middleware and handlers
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  asyncCatch(async (_req: any, res: any, _next: any) => {
    const data = await getAppStatus()
    res.status(200).json({
      data
    })
  })
)

export default router
