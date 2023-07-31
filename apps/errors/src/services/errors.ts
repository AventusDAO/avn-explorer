import { ExtrinsicError } from '../model'
import { Context } from '../index'

export async function saveErrors(ctx: Context, items: ExtrinsicError[]): Promise<void> {
  await ctx.store.save(items)
  ctx.log.child('errors').info(`updated: ${[...items.values()].length}`)
}
