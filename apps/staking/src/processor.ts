import { getProcessor } from '@avn/config'
import {
  BatchContext,
  BatchProcessorEventItem,
  BatchProcessorItem,
  toHex,
  decodeHex
} from '@subsquid/substrate-processor'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import { getLastChainState, setChainState } from './services/chainState'
import { stakingNominatorEventHandlers } from './handlers/stakingHandlers'
import { AddressHex, Address } from '@avn/types'
import { getNominators, saveAccounts } from './services/accounts'
import {
  IRewardedData,
  ParachainStakingNominatorEventName,
  ParachainStakingRewardsEventName
} from './types/custom'
import { rewardedEventHandlers } from './handlers'

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

const processStaking = async (ctx: Context): Promise<void> => {
  const pendingNominators = new Set<AddressHex>()
  const rewardsCollected = new Map<AddressHex, IRewardedData>()

  for (const block of ctx.blocks) {
    block.items
      .filter(item => Object.keys(ParachainStakingNominatorEventName).includes(item.name))
      .map(item => getNominatorAddress(ctx, item))
      .map(n => toHex(n))
      .forEach(pendingNominators.add, pendingNominators)

    block.items
      .filter(item => Object.keys(ParachainStakingRewardsEventName).includes(item.name))
      .map(item => getReward(ctx, item))
      .forEach(item => {
        const id = toHex(item.id)
        const existingRewards = rewardsCollected.get(id)?.amount ?? 0n
        const newRewards = existingRewards + item.amount
        rewardsCollected.set(id, {
          id: item.id,
          amount: newRewards
        })
      })

    if (lastStateTimestamp == null) {
      lastStateTimestamp = (await getLastChainState(ctx.store))?.timestamp.getTime() ?? 0
    }

    if (block.header.timestamp - lastStateTimestamp >= SAVE_PERIOD) {
      const nominators = await getNominators(
        ctx,
        block.header,
        [...pendingNominators].map(decodeHex)
      )
      await saveAccounts(ctx, block.header, nominators, [...rewardsCollected.values()])
      await setChainState(ctx, block.header)

      lastStateTimestamp = block.header.timestamp
      pendingNominators.clear()
      rewardsCollected.clear()
    }
  }

  const block = ctx.blocks[ctx.blocks.length - 1]
  const nominators = await getNominators(ctx, block.header, [...pendingNominators].map(decodeHex))
  await saveAccounts(ctx, block.header, nominators, [...rewardsCollected.values()])
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
