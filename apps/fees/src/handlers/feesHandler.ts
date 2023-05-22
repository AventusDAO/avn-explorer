import { UnknownVersionError } from '@avn/types'
import { IEventHandler, IFeePaidData, TransactionPaymentFeesEventName } from '../types/custom'
import { TransactionPaymentTransactionFeePaidEvent } from '../types/generated/parachain-testnet/events'

export const handleFeePaid: IEventHandler = (ctx, event): IFeePaidData => {
  const data = new TransactionPaymentTransactionFeePaidEvent(ctx, event)
  if (data.isV8) {
    return {
      who: data.asV8.who,
      actualFee: data.asV8.actualFee,
      tip: data.asV8.tip
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
