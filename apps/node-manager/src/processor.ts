import {
  BatchContext,
  BatchProcessorEventItem,
  BatchProcessorItem
} from '@subsquid/substrate-processor'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import { getProcessor } from '@avn/config'
import { Account, Node, Reward } from './model'

const processor = getProcessor()

export const nodeManagerEvents = ['NodeManager.NodeRegistered', 'NodeManager.RewardPaid']

const standardEventConfig = {
  data: {
    event: {
      args: true,
      extrinsic: {
        signature: true,
        hash: true,
        indexInBlock: true
      },
      call: { origin: true, args: true }
    }
  }
} as const

nodeManagerEvents.forEach(e => {
  processor.addEvent(e, standardEventConfig)
})

type Item = BatchProcessorItem<typeof processor>
type EventItem = BatchProcessorEventItem<typeof processor>
type Context = BatchContext<Store, Item>

export type ProcessingContext = {
  store: Store
  event: EventItem
  blockTimestamp: number
  log: any
}

export type EventProcessor = (ctx: ProcessingContext) => Promise<void>

async function main(ctx: Context): Promise<void> {
  for (const block of ctx.blocks) {
    for (const item of block.items) {
      ctx.log.info(`Processing item: ${item.kind} ${item.name}`)
      if (item.kind === 'event' && nodeManagerEvents.includes(item.name)) {
        if (nodeManagerEvents.includes(item.name)) {
          ctx.log.info(`Processing event: ${JSON.stringify(item)}`)
          await processEvent({
            store: ctx.store,
            event: item,
            blockTimestamp: block.header.timestamp,
            log: ctx.log
          })
        }
      }
    }
  }
}

export const processNodeRegistered: EventProcessor = async ({
  store,
  event,
  blockTimestamp
}: ProcessingContext) => {
  // @ts-expect-error
  const { owner, node } = event.event.args

  let account = await store.get(Account, owner)
  if (!account) {
    account = new Account({
      id: owner
    })
    await store.save(account)
  }

  const nodeEntity = new Node({
    id: node,
    owner: account,
    blockTimestamp: new Date(blockTimestamp)
  })
  await store.save(nodeEntity)
}

export const processRewardPaid: EventProcessor = async ({
  store,
  event,
  blockTimestamp,
  log
}: ProcessingContext) => {
  // @ts-expect-error
  const { rewardPeriod, owner, node, amount } = event.event.args
  log.info(
    `Processing RewardPaid event: ${rewardPeriod}, Owner: ${owner}, node: ${node}, ${amount}`
  )

  const account = await store.get(Account, owner)
  const nodeEntity = await store.get(Node, node)

  if (!account || !nodeEntity) {
    log.error(`Account or Node not found for reward payment: ${owner}, ${node}`)
    return
  }

  const reward = new Reward({
    // @ts-expect-error
    id: `${blockTimestamp}-${event.event.extrinsic.indexInBlock}`,
    rewardPeriod,
    owner: account,
    node: nodeEntity,
    amount,
    blockTimestamp: new Date(blockTimestamp)
  })
  await store.save(reward)
}

const eventHandlers: Record<string, EventProcessor> = {
  'NodeManager.NodeRegistered': processNodeRegistered,
  'NodeManager.RewardPaid': processRewardPaid
}

export const processEvent = async (ctx: ProcessingContext): Promise<void> => {
  const handler = eventHandlers[ctx.event.name]
  if (handler) {
    await handler(ctx)
  } else {
    ctx.log.error(`No handler for event: ${ctx.event.name}`)
  }
}

processor.run(new TypeormDatabase(), main)
