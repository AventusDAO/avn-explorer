import { ChainContext, Event } from '../types/generated/parachain-dev/support'
import {
  ParachainStakingNominationEvent,
  ParachainStakingNominationDecreasedEvent,
  ParachainStakingNominationIncreasedEvent,
  ParachainStakingNominationKickedEvent,
  ParachainStakingNominationRevokedEvent,
  ParachainStakingNominatorLeftEvent,
  ParachainStakingNominatorLeftCandidateEvent
} from '../types/generated/parachain-dev/events'
import { ParachainStakingEventName } from '../types/custom'
import { Address, UnknownVersionError } from '@avn/types'

type IEventHandler<T = any> = (ctx: ChainContext, event: Event) => T
type INominatorEventHandler = IEventHandler<Address>

const handleNominationIncreased: INominatorEventHandler = (ctx, event): Address => {
  const data = new ParachainStakingNominationIncreasedEvent(ctx, event)
  if (data.isV12) {
    return data.asV12.nominator
  } else {
    throw new UnknownVersionError(event.name)
  }
}

const handleNominationDecreased: INominatorEventHandler = (ctx, event): Address => {
  const data = new ParachainStakingNominationDecreasedEvent(ctx, event)
  if (data.isV12) {
    return data.asV12.nominator
  } else {
    throw new UnknownVersionError(event.name)
  }
}

const handleNominatorLeft: INominatorEventHandler = (ctx, event): Address => {
  const data = new ParachainStakingNominatorLeftEvent(ctx, event)
  if (data.isV12) {
    return data.asV12.nominator
  } else {
    throw new UnknownVersionError(event.name)
  }
}
const handleNominationRevoked: INominatorEventHandler = (ctx, event): Address => {
  const data = new ParachainStakingNominationRevokedEvent(ctx, event)
  if (data.isV12) {
    return data.asV12.nominator
  } else {
    throw new UnknownVersionError(event.name)
  }
}

const handleNominationKicked: INominatorEventHandler = (ctx, event): Address => {
  const data = new ParachainStakingNominationKickedEvent(ctx, event)
  if (data.isV12) {
    return data.asV12.nominator
  } else {
    throw new UnknownVersionError(event.name)
  }
}

const handleNomination: INominatorEventHandler = (ctx, event): Address => {
  const data = new ParachainStakingNominationEvent(ctx, event)
  if (data.isV12) {
    return data.asV12.nominator
  } else {
    throw new UnknownVersionError(event.name)
  }
}

const handleNominatorLeftCandidate: INominatorEventHandler = (ctx, event): Address => {
  const data = new ParachainStakingNominatorLeftCandidateEvent(ctx, event)
  if (data.isV12) {
    return data.asV12.nominator
  } else {
    throw new UnknownVersionError(event.name)
  }
}

export const stakingNominatorEventHandlers: Record<
  ParachainStakingEventName,
  INominatorEventHandler
> = {
  'ParachainStaking.NominationIncreased': handleNominationIncreased,
  'ParachainStaking.NominationDecreased': handleNominationDecreased,
  'ParachainStaking.NominatorLeft': handleNominatorLeft,
  'ParachainStaking.NominationRevoked': handleNominationRevoked,
  'ParachainStaking.NominationKicked': handleNominationKicked,
  'ParachainStaking.Nomination': handleNomination,
  'ParachainStaking.NominatorLeftCandidate': handleNominatorLeftCandidate
}
