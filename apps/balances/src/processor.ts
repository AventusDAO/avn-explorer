import {
  BatchContext,
  BatchProcessorCallItem,
  BatchProcessorEventItem,
  BatchProcessorItem,
  decodeHex,
  SubstrateBlock,
  SubstrateCall
} from '@subsquid/substrate-processor'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import { randomUUID } from 'crypto'
import { getProcessor } from '@avn/config'
import { getLastChainState, saveCurrentChainState, saveRegularChainState } from './chainState'
import { Account, Balance } from './model'
import {
  getBalanceSetAccount,
  getDepositAccount,
  getEndowedAccount,
  getReservedAccount,
  getReserveRepatriatedAccounts,
  getSlashedAccount,
  getTransferAccounts,
  getUnreservedAccount,
  getWithdrawAccount
} from './eventHandlers'
import { IBalance } from './types/custom/balance'

import {
  BalancesAccountStorage,
  SystemAccountStorage
} from './types/generated/parachain-dev/storage'
import { Block, ChainContext } from './types/generated/parachain-dev/support'
import { encodeId } from '@avn/utils'

const processor = getProcessor()
  .addEvent('Balances.Endowed', {
    data: { event: { args: true } }
  } as const)
  .addEvent('Balances.Transfer', {
    data: { event: { args: true } }
  } as const)
  .addEvent('Balances.BalanceSet', {
    data: { event: { args: true } }
  } as const)
  .addEvent('Balances.Reserved', {
    data: { event: { args: true } }
  } as const)
  .addEvent('Balances.Unreserved', {
    data: { event: { args: true } }
  } as const)
  .addEvent('Balances.ReserveRepatriated', {
    data: { event: { args: true } }
  } as const)
  .addEvent('Balances.Deposit', {
    data: { event: { args: true } }
  } as const)
  .addEvent('Balances.Withdraw', {
    data: { event: { args: true } }
  } as const)
  .addEvent('Balances.Slashed', {
    data: { event: { args: true } }
  } as const)
  .addCall('*', {
    data: { call: { origin: true } }
  } as const)
  .includeAllBlocks()

type Item = BatchProcessorItem<typeof processor>
type EventItem = BatchProcessorEventItem<typeof processor>
type CallItem = BatchProcessorCallItem<typeof processor>
type Context = BatchContext<Store, Item>

processor.run(new TypeormDatabase(), processBalances)

const SAVE_PERIOD = 12 * 60 * 60 * 1000
let lastStateTimestamp: number | undefined

async function processBalances(ctx: Context): Promise<void> {
  const accountIdsHex = new Set<string>()
  let balances: IBalance[] | undefined

  for (const block of ctx.blocks) {
    for (const item of block.items) {
      if (item.kind === 'call') {
        processBalancesCallItem(ctx, item, accountIdsHex)
      } else if (item.kind === 'event') {
        processBalancesEventItem(ctx, item, accountIdsHex, block.header)
      }
    }

    if (lastStateTimestamp == null) {
      lastStateTimestamp = (await getLastChainState(ctx.store))?.timestamp.getTime() ?? 0
    }
    if (block.header.timestamp - lastStateTimestamp >= SAVE_PERIOD) {
      const accountIdsU8 = [...accountIdsHex].map(id => decodeHex(id))
      balances = await getBalances(ctx, block.header, accountIdsU8)
      if (!balances) {
        ctx.log.warn('No balances')
      }

      await saveAccounts(ctx, block.header, accountIdsU8, balances)
      await saveRegularChainState(ctx, block.header)

      lastStateTimestamp = block.header.timestamp
      accountIdsHex.clear()
    }
  }

  const block = ctx.blocks[ctx.blocks.length - 1]
  const accountIdsU8 = [...accountIdsHex].map(id => decodeHex(id))
  balances = await getBalances(ctx, block.header, accountIdsU8)

  await saveAccounts(ctx, block.header, accountIdsU8, balances)
  await saveBalances(ctx, block.header, accountIdsU8, balances)
  await saveCurrentChainState(ctx, block.header)
}

async function saveAccounts(
  ctx: Context,
  block: SubstrateBlock,
  accountIds: Uint8Array[],
  balances?: IBalance[]
) {
  const accounts = new Map<string, Account>()
  const deletions = new Map<string, Account>()

  for (let i = 0; i < accountIds.length; i++) {
    const id = encodeId(accountIds[i])
    const balance = balances?.[i]

    if (!balance) continue
    const total = balance.free + balance.reserved
    if (total > 0n) {
      accounts.set(
        id,
        new Account({
          id,
          updatedAt: block.height
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

async function saveBalances(
  ctx: Context,
  block: SubstrateBlock,
  accountIds: Uint8Array[],
  balances?: IBalance[]
) {
  const balancesMap: { [id: string]: Balance } = {}
  const accountBalances = await Promise.all(
    accountIds.map(async id => {
      const accountId = encodeId(id)
      return await ctx.store.findOne(Balance, {
        where: { accountId },
        order: { updatedAt: 'DESC' }
      })
    })
  )

  for (let i = 0; i < accountIds.length; i++) {
    const id = encodeId(accountIds[i])
    const balance = balances?.[i]

    if (!balance) continue

    const total = balance.free + balance.reserved
    const dbBalance = accountBalances.find(a => a?.accountId === id)

    if (dbBalance && total === dbBalance.total) {
      continue
    }

    balancesMap[id] = new Balance({
      id: randomUUID(),
      accountId: id,
      free: balance.free,
      reserved: balance.reserved,
      total,
      updatedAt: block.height
    })
  }

  await ctx.store.save([...Object.values(balancesMap)])

  ctx.log.child('balances').info(`updated: ${Object.values(balancesMap).length}`)
}

function processBalancesCallItem(
  ctx: Context,
  item: CallItem,
  accountIdsHex: Set<string>
) {
  const call = item.call as SubstrateCall
  if (call.parent != null) return

  const id = getOriginAccountId(call.origin)
  if (id == null) return

  accountIdsHex.add(id)
}

function processBalancesEventItem(
  ctx: Context,
  item: EventItem,
  accountIdsHex: Set<string>,
  block: SubstrateBlock
) {
  switch (item.name) {
    case 'Balances.BalanceSet': {
      const account = getBalanceSetAccount(ctx, item.event)

      accountIdsHex.add(account)
      break
    }
    case 'Balances.Endowed': {
      const account = getEndowedAccount(ctx, item.event)
      accountIdsHex.add(account)
      break
    }
    case 'Balances.Deposit': {
      const account = getDepositAccount(ctx, item.event)
      accountIdsHex.add(account)
      break
    }
    case 'Balances.Reserved': {
      const account = getReservedAccount(ctx, item.event)
      accountIdsHex.add(account)
      break
    }
    case 'Balances.Unreserved': {
      const account = getUnreservedAccount(ctx, item.event)
      accountIdsHex.add(account)
      break
    }
    case 'Balances.Withdraw': {
      const account = getWithdrawAccount(ctx, item.event)
      accountIdsHex.add(account)
      break
    }
    case 'Balances.Slashed': {
      const account = getSlashedAccount(ctx, item.event)
      accountIdsHex.add(account)
      break
    }
    case 'Balances.Transfer': {
      const accounts = getTransferAccounts(ctx, item.event)
      accountIdsHex.add(accounts[0])
      accountIdsHex.add(accounts[1])
      break
    }
    case 'Balances.ReserveRepatriated': {
      const accounts = getReserveRepatriatedAccounts(ctx, item.event)
      accountIdsHex.add(accounts[0])
      accountIdsHex.add(accounts[1])
      break
    }
  }
}

async function getBalances(
  ctx: ChainContext,
  block: Block,
  accounts: Uint8Array[]
): Promise<IBalance[] | undefined> {
  return (
    (await getSystemAccountBalances(ctx, block, accounts)) ??
    (await getBalancesAccountBalances(ctx, block, accounts))
  )
}

async function getBalancesAccountBalances(
  ctx: ChainContext,
  block: Block,
  accounts: Uint8Array[]
): Promise<IBalance[] | undefined> {
  const storage = new BalancesAccountStorage(ctx, block)
  if (!storage.isExists) return undefined

  const data = await ctx._chain.queryStorage(
    block.hash,
    'Balances',
    'Account',
    accounts.map(a => [a])
  )

  return data.map(d => ({ free: d.free, reserved: d.reserved }))
}

async function getSystemAccountBalances(
  ctx: ChainContext,
  block: Block,
  accounts: Uint8Array[]
): Promise<IBalance[] | undefined> {
  const storage = new SystemAccountStorage(ctx, block)
  if (!storage.isExists) return undefined

  const data = await ctx._chain.queryStorage(
    block.hash,
    'System',
    'Account',
    accounts.map(a => [a])
  )

  return data.map(d => ({
    free: d.data.free,
    reserved: d.data.reserved
  })) as IBalance[]
}


// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getOriginAccountId(origin: any) {
  if (
    origin &&
    origin.__kind === 'system' &&
    origin.value.__kind === 'Signed'
  ) {
    return origin.value.value
  } else {
    return undefined
  }
}
