import { Account } from '../model'
import * as ss58 from '@subsquid/ss58'
import { NetworkPrefix } from '@avn/config/lib/types'
import { getConfig } from '@avn/config'
import { SubstrateBlock, decodeHex } from '@subsquid/substrate-processor'
import { Context } from '../processor'
import { Address, AddressEncoded, AddressHex } from '../types/custom'
import { Block, ChainContext } from '../types/generated/parachain-dev/support'

const config = getConfig()

export function encodeId(id: Uint8Array, prefix: NetworkPrefix = config.prefix): AddressEncoded {
  return ss58.codec(prefix).encode(id)
}

export async function saveAccounts(
  ctx: Context,
  block: SubstrateBlock,
  nominations: Array<[AddressHex, bigint]>
): Promise<void> {
  const accounts = new Map<string, Account>()
  const deletions = new Map<string, Account>()

  for (let i = 0; i < nominations.length; i++) {
    const [address, stakedAmount] = nominations[i]
    const id = encodeId(decodeHex(address))

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

export async function getNominations(
  ctx: ChainContext,
  block: Block,
  accounts: AddressHex[]
): Promise<Array<[AddressHex, bigint]>> {
  // todo:
  return await Promise.resolve(accounts.map(a => [a, 0n]))
}
