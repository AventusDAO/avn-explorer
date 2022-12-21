import { getProcessor } from '@avn/config'
import {
  BatchContext,
  BatchProcessorEventItem,
  BatchProcessorItem,
  toHex
} from '@subsquid/substrate-processor'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import { getLastChainState, setChainState } from './services/chainState'
import { stakingNominatorEventHandlers } from './handlers/stakingHandlers'
import { AddressHex, Address } from '@avn/types'
import { getNominators, saveAccounts } from './services/accounts'
import {
  IRewardedData,
  IStakingAccountUpdate,
  ParachainStakingNominatorEventName,
  ParachainStakingRewardsEventName
} from './types/custom'
import { rewardedEventHandlers } from './handlers'
import { Block } from './types/generated/parachain-dev/support'

type Item = BatchProcessorItem<typeof processor>
type EventItem = BatchProcessorEventItem<typeof processor>
export type Context = BatchContext<Store, Item>

const SAVE_PERIOD = 12 * 60 * 60 * 1000
let lastStateTimestamp: number | undefined

const processor = getProcessor()
  .addEvent('ParachainStaking.NominationIncreased', {
    data: { event: { args: true } }
  } as const)
  .addEvent('ParachainStaking.NominationDecreased', {
    data: { event: { args: true } }
  } as const)
  .addEvent('ParachainStaking.NominatorLeft', {
    data: { event: { args: true } }
  } as const)
  .addEvent('ParachainStaking.NominationRevoked', {
    data: { event: { args: true } }
  } as const)
  .addEvent('ParachainStaking.NominationKicked', {
    data: { event: { args: true } }
  } as const)
  .addEvent('ParachainStaking.Nomination', {
    data: { event: { args: true } }
  } as const)
  .addEvent('ParachainStaking.NominatorLeftCandidate', {
    data: { event: { args: true } }
  } as const)
  .addEvent('ParachainStaking.Rewarded', {
    data: { event: { args: true } }
  })


class StakingUpdates {
  #ctx: Context
  #updates = new Map<AddressHex, IStakingAccountUpdate>()

  constructor(ctx: Context) {
    this.#ctx = ctx
  }

  private getItem(id: Address): IStakingAccountUpdate | undefined {
    const hexId = toHex(id)
    return this.#updates.get(hexId)
  }

  private setItem(update: IStakingAccountUpdate): void {
    const hexId = toHex(update.id)
    this.#updates.set(hexId, update)
  }

  private hasFetchedNominations(): boolean {
    return ![...this.#updates.values()].find(item => item.hasNominations && !!item.nominationsTotal)
  }

  addNominator(id: Address): void {
    const existingUpdate = this.getItem(id)
    if (!existingUpdate) {
      return this.setItem({
        id,
        hasNominations: true,
        rewards: []
      })
    }
    existingUpdate.hasNominations = true
  }

  addReward(data: IRewardedData): void {
    const { id, amount } = data
    const existingUpdate = this.getItem(id)
    if (!existingUpdate) {
      return this.setItem({
        id: data.id,
        hasNominations: false,
        rewards: [data.amount]
      })
    }
    existingUpdate.rewards.push(amount)
  }

  async fetchTotalNominations(block: Block): Promise<void> {
    const nominatorIds = [...this.#updates.values()]
      .filter(acc => !!acc.hasNominations)
      .map(acc => acc.id)
    const nominators = await getNominators(this.#ctx, block, nominatorIds)
    nominators.forEach(nominator => {
      const update = this.#updates.get(toHex(nominator.id))
      if (!update) throw new Error(`Could not find pending update for a nominator`)
      update.nominationsTotal = nominator.total
    })
  }

  getAll(): IStakingAccountUpdate[] {
    if (!this.hasFetchedNominations)
      this.#ctx.log.child('StakingUpdates').warn('Forgot to fetch nominations')
    return [...this.#updates.values()]
  }

  clear(): void {
    this.#updates.clear()
  }
}

const processStaking = async (ctx: Context): Promise<void> => {
  const pendingUpdates: StakingUpdates = new StakingUpdates(ctx)

  for (const block of ctx.blocks) {
    block.items
      .filter(item =>
        (Object.values(ParachainStakingNominatorEventName) as string[]).includes(item.name)
      )
      .map(item => getNominatorAddress(ctx, item))
      .forEach(pendingUpdates.addNominator, pendingUpdates)

    block.items
      .filter(item =>
        (Object.values(ParachainStakingRewardsEventName) as string[]).includes(item.name)
      )
      .map(item => getReward(ctx, item))
      .forEach(pendingUpdates.addReward, pendingUpdates)

    if (lastStateTimestamp == null) {
      lastStateTimestamp = (await getLastChainState(ctx.store))?.timestamp.getTime() ?? 0
    }

    if (block.header.timestamp - lastStateTimestamp >= SAVE_PERIOD) {
      await pendingUpdates.fetchTotalNominations(block.header)
      await saveAccounts(ctx, block.header, pendingUpdates.getAll())
      await setChainState(ctx, block.header)

      lastStateTimestamp = block.header.timestamp
      pendingUpdates.clear()
    }
  }

  const block = ctx.blocks[ctx.blocks.length - 1]
  await pendingUpdates.fetchTotalNominations(block.header)
  await saveAccounts(ctx, block.header, pendingUpdates.getAll())
  await setChainState(ctx, block.header)
}

function getNominatorAddress(ctx: Context, item: Item): Address {
  if (item.kind !== 'event') {
    throw new Error(`Unhandled items of kind: ${item.kind}, name: ${item.name}`)
  }

  item = item as EventItem
  if (item.name === '*') {
    throw new Error(`Missing event handler for event item: *, name: ${item.event.name}`)
  } else if (item.name === 'ParachainStaking.Rewarded') {
    throw new Error(`Wrong event type`)
  }

  const handler = stakingNominatorEventHandlers[item.name]
  if (!handler) throw new Error(`Missing handler for event: ${item.name}`)
  return handler(ctx, item.event)
}

function getReward(ctx: Context, item: Item): IRewardedData {
  if (item.kind !== 'event') {
    throw new Error(`Unhandled items of kind: ${item.kind}, name: ${item.name}`)
  }

  item = item as EventItem
  if (item.name !== 'ParachainStaking.Rewarded') {
    throw new Error(`Wrong event type`)
  }

  const handler = rewardedEventHandlers[item.name]
  if (!handler) throw new Error(`Missing handler for event: ${item.name}`)
  return handler(ctx, item.event)
}

processor.run(new TypeormDatabase(), processStaking)
