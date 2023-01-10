import { Account } from '../model'
import { Context as ParachainContext } from '../processors/parachain-processor'
import { Context as SolochainContext } from '../processors/solochain-processor'
import { SubstrateBlock } from '@subsquid/substrate-processor'
import { encodeId } from '@avn/utils'
import { IFeesAccountUpdate } from '../types/custom'
import { In } from 'typeorm'

export async function saveAccounts(
  ctx: ParachainContext | SolochainContext,
  block: SubstrateBlock,
  updates: IFeesAccountUpdate[]
): Promise<void> {
  const existingAccounts = await ctx.store.find(Account, {
    where: {
      id: In(updates.map(item => encodeId(item.id)))
    }
  })

  const accounts = updates.map(item => {
    const id = encodeId(item.id)
    const newFees = item.fees.reduce((prev, curr) => prev + curr, 0n)
    const newTips = item.tips.reduce((prev, curr) => prev + curr, 0n)
    const updatedAt = block.height
    const existingAccount = existingAccounts.find(acc => acc.id === id)
    if (existingAccount) {
      const feesTotal = existingAccount.feesTotal + newFees + newTips
      return new Account({
        id,
        feesTotal,
        updatedAt
      })
    } else {
      return new Account({
        id,
        updatedAt,
        feesTotal: newFees + newTips
      })
    }
  })

  await ctx.store.save(accounts)

  ctx.log.child('accounts').info(`updated: ${[...accounts.values()].length}`)
}
