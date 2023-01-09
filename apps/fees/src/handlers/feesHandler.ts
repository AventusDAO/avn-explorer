import { UnknownVersionError } from '@avn/types'
import { IEventHandler, IFeePaidData, TransactionPaymentFeesEventName } from '../types/custom'
import { TransactionPaymentTransactionFeePaidEvent } from '../types/generated/parachain-dev/events'

export const handleFeePaid: IEventHandler = (ctx, event): IFeePaidData => {
  const data = new TransactionPaymentTransactionFeePaidEvent(ctx, event)
  if (data.isV12) {
    return {
      who: data.asV12.who,
      actualFee: data.asV12.actualFee,
      tip: data.asV12.tip
    }
  } else {
    throw new UnknownVersionError(event.name)
  }
}

export const feesEventHandlers: Record<
  TransactionPaymentFeesEventName,
  IEventHandler<IFeePaidData>
> = {
  'TransactionPayment.TransactionFeePaid': handleFeePaid
}
