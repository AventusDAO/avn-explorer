import { Account } from '../model'
import * as ss58 from '@subsquid/ss58'
import { NetworkPrefix } from '@avn/config/lib/types'
import { getConfig } from '@avn/config'
import { SubstrateBlock, decodeHex } from '@subsquid/substrate-processor'
import { Context } from '../processor'
import { Address, AddressEncoded, AddressHex, INominator } from '../types/custom'
import { Block } from '../types/generated/parachain-dev/support'
import { ParachainStakingNominatorStateStorage } from '../types/generated/parachain-dev/storage'
import { UnknownVersionError } from '../handlers/errors'
import { Nominator as NominatorV12 } from '../types/generated/parachain-dev/v12'

const config = getConfig()

export function encodeId(id: Uint8Array, prefix: NetworkPrefix = config.prefix): AddressEncoded {
  return ss58.codec(prefix).encode(id)
}

export async function saveAccounts(
  ctx: Context,
  block: SubstrateBlock,
  nominators: INominator[]
): Promise<void> {
  const accounts = new Map<string, Account>()
  const deletions = new Map<string, Account>()

  for (let i = 0; i < nominators.length; i++) {
    const { id: address, total: stakedAmount } = nominators[i]
    const id = encodeId(address)

    if (stakedAmount > 0n) {
      accounts.set(
        id,
        new Account({
          id,
          updatedAt: block.height,
          stakedAmount
        })
      )
    } else {
      deletions.set(id, new Account({ id }))
    }
  }

  await ctx.store.save([...accounts.values()])
  await ctx.store.remove([...deletions.values()])

  ctx.log.child('accounts').info(`updated: ${accounts.size}, deleted: ${deletions.size}`)
}

export async function getNominators(
  ctx: Context,
  block: Block,
  accounts: AddressHex[]
): Promise<INominator[]> {
  const storage = new ParachainStakingNominatorStateStorage(ctx, block)
  if (!storage.isExists) ctx.log.error(`Missing ParachainStakingNominatorStateStorage`)
  if (storage.isV12) {
    const nominatorsRes = await storage.getManyAsV12(accounts.map(decodeHex))
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
