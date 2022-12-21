import { Account } from '../model'
import { SubstrateBlock } from '@subsquid/substrate-processor'
import { Context } from '../processor'
import { Address, UnknownVersionError } from '@avn/types'
import { encodeId } from '@avn/utils'
import { INominationData, IStakingAccountUpdate } from '../types/custom'
import { Block } from '../types/generated/parachain-dev/support'
import { ParachainStakingNominatorStateStorage } from '../types/generated/parachain-dev/storage'
import { Nominator as NominatorV12 } from '../types/generated/parachain-dev/v12'
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
      const totalRewards = existingAccount.totalRewards + newRewards
      const stakedAmount = item.nominationsTotal ?? existingAccount.stakedAmount
      return new Account({
        id,
        totalRewards,
        updatedAt,
        stakedAmount
      })
    } else {
      return new Account({
        id,
        updatedAt,
        totalRewards: newRewards,
        stakedAmount: item.nominationsTotal ?? 0n
      })
    }
  })

  await ctx.store.save(accounts)

  ctx.log.child('accounts').info(`updated: ${[...accounts.values()].length}`)
}

export async function getNominators(
  ctx: Context,
  block: Block,
  accounts: Address[]
): Promise<INominationData[]> {
  const storage = new ParachainStakingNominatorStateStorage(ctx, block)
  if (!storage.isExists) ctx.log.error(`Missing ParachainStakingNominatorStateStorage`)
  if (storage.isV12) {
    const nominatorsRes = await storage.getManyAsV12(accounts)
    if (nominatorsRes.find(n => !n)) throw new Error(`Nominator is undefined`)
    const nominators = nominatorsRes as NominatorV12[]
    return nominators.map(n => ({
      id: n.id,
      total: n.total
    }))
  } else {
    throw new UnknownVersionError(`ParachainStakingNominatorStateStorage`)
  }
}
