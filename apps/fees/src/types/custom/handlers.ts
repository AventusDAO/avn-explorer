import { ChainContext, Event } from '../generated/parachain-dev/support'

export type IEventHandler<T = any> = (ctx: ChainContext, event: Event) => T
