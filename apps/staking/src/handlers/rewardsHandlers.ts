import { UnknownVersionError } from '@avn/types'
import { IEventHandler, ParachainStakingRewardsEventName, IRewardedData } from '../types/custom'
import { ParachainStakingRewardedEvent } from '../types/generated/parachain-dev/events'

export const handleRewarded: IEventHandler = (ctx, event): IRewardedData => {
  const data = new ParachainStakingRewardedEvent(ctx, event)
  if (data.isV21) {
    return {
      id: data.asV21.account,
      amount: data.asV21.rewards
    }
  } else {
    throw new UnknownVersionError(event.name)
  }
}

export const rewardedEventHandlers: Record<
  ParachainStakingRewardsEventName,
  IEventHandler<IRewardedData>
> = {
  'ParachainStaking.Rewarded': handleRewarded
}
