import { Account } from '../model'
import { SubstrateBlock } from '@subsquid/substrate-processor'
import { Context } from '../processor'
import { Address, UnknownVersionError } from '@avn/types'
import { encodeId } from '@avn/utils'
import { INominationData, IStakingAccountUpdate } from '../types/custom'
import { Block } from '../types/generated/parachain-dev/support'
import { ParachainStakingNominatorStateStorage } from '../types/generated/parachain-dev/storage'
import { Nominator as NominatorV21 } from '../types/generated/parachain-dev/v21'
import { In } from 'typeorm'

export async function saveAccounts(
  ctx: Context,
  block: SubstrateBlock,
  updates: IStakingAccountUpdate[]
): Promise<void> {
  const existingAccounts = await ctx.store.find(Account, {
    where: {
      id: In(updates.map(item => encodeId(item.id)))
    }
  })

  const accounts = updates.map(item => {
    const id = encodeId(item.id)
    const newRewards = item.rewards.reduce((prev, curr) => prev + curr, 0n)
    const updatedAt = block.height
    const existingAccount = existingAccounts.find(acc => acc.id === id)
    if (existingAccount) {
      const rewardsTotal = existingAccount.rewardsTotal + newRewards
      const stakedAmountTotal = item.nominationsTotal ?? existingAccount.stakedAmountTotal
      return new Account({
        id,
        rewardsTotal,
        updatedAt,
        stakedAmountTotal
      })
    } else {
      return new Account({
        id,
        updatedAt,
        rewardsTotal: newRewards,
        stakedAmountTotal: item.nominationsTotal ?? 0n
      })
    }
  })

  await ctx.store.save(accounts)

  ctx.log.child('accounts').info(`updated: ${[...accounts.values()].length}`)
}

export async function getNominations(
  ctx: Context,
  block: Block,
  accounts: Address[]
): Promise<INominationData[]> {
  const storage = new ParachainStakingNominatorStateStorage(ctx, block)
  if (!storage.isExists) ctx.log.error(`Missing ParachainStakingNominatorStateStorage`)
  if (storage.isV21) {
    const nominatorsRes = await storage.asV21.getMany(accounts)

    // if (nominatorsRes.find(n => !n)) throw new Error(`Nominator is undefined`)
    const nominators = nominatorsRes.filter(Boolean) as NominatorV21[]
    return nominators.filter(Boolean).map(n => ({
      id: n.id,
      total: n.total
    }))
  } else {
    throw new UnknownVersionError(`ParachainStakingNominatorStateStorage`)
  }
}
