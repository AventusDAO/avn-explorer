import { Account } from '../model'
import { SubstrateBlock } from '@subsquid/substrate-processor'
import { Context } from '../processor'
import { Address, UnknownVersionError } from '@avn/types'
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

export async function saveAccounts(
  ctx: Context,
  block: SubstrateBlock,
  nominators: INominator[],
  rewards: IRewardedData[]
): Promise<void> {
  const accounts = nominators
    .filter(n => n.total > 0n)
    .map(nominator => mapINominatorToAccount(nominator, block))

  const deletions = nominators
    .filter(n => n.total <= 0n)
    .map(nominator => mapINominatorToAccount(nominator, block))

  await ctx.store.save([...accounts])
  await ctx.store.remove([...deletions])

  ctx.log.child('accounts').info(`updated: ${accounts.length}, deleted: ${deletions.length}`)
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
