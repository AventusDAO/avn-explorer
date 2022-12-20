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

type StakingUpdates = Map<AddressHex, IStakingAccountUpdate>

const fetchTotalNominationsForUpdates = async (
  ctx: Context,
  block: Block,
  updates: StakingUpdates
): Promise<void> => {
  const getNominationUpdates = (up: StakingUpdates): IStakingAccountUpdate[] =>
    [...up.values()].filter(acc => !!acc.hasNominations)

  const nominatorIds = getNominationUpdates(updates).map(acc => acc.id)
  const nominators = await getNominators(ctx, block, nominatorIds)
  nominators.forEach(nominator => {
    const update = updates.get(toHex(nominator.id))
    if (!update) throw new Error(`Could not find pending update for a nominator`)
    update.nominationsTotal = nominator.total
  })
}

const processStaking = async (ctx: Context): Promise<void> => {
  const pendingUpdates: StakingUpdates = new Map<AddressHex, IStakingAccountUpdate>()

  for (const block of ctx.blocks) {
    block.items
      .filter(item =>
        (Object.values(ParachainStakingNominatorEventName) as string[]).includes(item.name)
      )
      .map(item => getNominatorAddress(ctx, item))
      .forEach((id: Address) => {
        const hexId = toHex(id)
        const pendingUpdate = pendingUpdates.get(hexId)
        if (pendingUpdate) {
          pendingUpdate.hasNominations = true
        } else {
          pendingUpdates.set(hexId, {
            id,
            hasNominations: true,
            rewards: []
          })
        }
      })

    block.items
      .filter(item =>
        (Object.values(ParachainStakingRewardsEventName) as string[]).includes(item.name)
      )
      .map(item => getReward(ctx, item))
      .forEach((data: IRewardedData) => {
        const hexId = toHex(data.id)
        const pendingUpdate = pendingUpdates.get(hexId)
        if (pendingUpdate) {
          pendingUpdate.rewards.push(data.amount)
        } else {
          pendingUpdates.set(hexId, {
            id: data.id,
            hasNominations: false,
            rewards: [data.amount]
          })
        }
      })

    if (lastStateTimestamp == null) {
      lastStateTimestamp = (await getLastChainState(ctx.store))?.timestamp.getTime() ?? 0
    }

    if (block.header.timestamp - lastStateTimestamp >= SAVE_PERIOD) {
      await fetchTotalNominationsForUpdates(ctx, block.header, pendingUpdates)
      await saveAccounts(ctx, block.header, [...pendingUpdates.values()])
      await setChainState(ctx, block.header)

      lastStateTimestamp = block.header.timestamp
      pendingUpdates.clear()
    }
  }

  const block = ctx.blocks[ctx.blocks.length - 1]
  await fetchTotalNominationsForUpdates(ctx, block.header, pendingUpdates)
  await saveAccounts(ctx, block.header, [...pendingUpdates.values()])
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
