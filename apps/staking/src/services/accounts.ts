import { Account } from '../model'
import { SubstrateBlock } from '@subsquid/substrate-processor'
import { Context } from '../processor'
import { Address, AddressEncoded, UnknownVersionError } from '@avn/types'
import { encodeId } from '@avn/utils'
import { INominator, IRewardedData } from '../types/custom'
import { Block } from '../types/generated/parachain-dev/support'
import { ParachainStakingNominatorStateStorage } from '../types/generated/parachain-dev/storage'
import { Nominator as NominatorV12 } from '../types/generated/parachain-dev/v12'

const mapINominatorToAccount = (nominator: INominator, block: SubstrateBlock): Account =>
  new Account({
    id: encodeId(nominator.id),
    updatedAt: block.height,
    stakedAmount: nominator.total
  })

const mapIRewardedDataToAccount = (rewardedData: IRewardedData, block: SubstrateBlock): Account =>
  new Account({
    id: encodeId(rewardedData.id),
    updatedAt: block.height,
    totalRewards: rewardedData.amount
  })

export async function saveAccounts(
  ctx: Context,
  block: SubstrateBlock,
  nominators: INominator[],
  rewarded: IRewardedData[]
): Promise<void> {
  const accounts = new Map<AddressEncoded, Account>()
  rewarded.map(r => mapIRewardedDataToAccount(r, block)).forEach(val => accounts.set(val.id, val))
  nominators.forEach(nominator => {
    const acc = accounts.get(encodeId(nominator.id))
    if (!acc) return mapINominatorToAccount(nominator, block)
    acc.stakedAmount = nominator.total
  })

  await ctx.store.save([...accounts.values()])
  ctx.log.child('accounts').info(`updated: ${[...accounts.values()].length}`)

  // const news = nominators
  //   .filter(n => n.total > 0n)
  //   .map(nominator => mapINominatorToAccount(nominator, block))
  // const deletions = nominators
  //   .filter(n => n.total <= 0n)
  //   .map(nominator => mapINominatorToAccount(nominator, block))
  // await ctx.store.save([...news])
  // await ctx.store.remove([...deletions])
  // ctx.log.child('accounts').info(`updated: ${news.length}`)
}

export async function getNominators(
  ctx: Context,
  block: Block,
  accounts: Address[]
): Promise<INominator[]> {
  const storage = new ParachainStakingNominatorStateStorage(ctx, block)
  if (!storage.isExists) ctx.log.error(`Missing ParachainStakingNominatorStateStorage`)
  if (storage.isV12) {
    const nominatorsRes = await storage.getManyAsV12(accounts)
    if (nominatorsRes.find(n => !n)) throw new Error(`Nominator is undefined`)
    const nominators = nominatorsRes as NominatorV12[]
    return nominators.map(n => {
      return {
        id: n.id,
        total: n.total
      }
    })
  } else {
    throw new UnknownVersionError(`ParachainStakingNominatorStateStorage`)
  }
}
