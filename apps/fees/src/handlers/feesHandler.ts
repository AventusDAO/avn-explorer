import { UnknownVersionError } from '@avn/types'
import {
  IEventHandler,
  IFeePaidAdjustedData,
  IFeePaidData,
  TransactionPaymentFeesEventName
} from '../types/custom'
import {
  AvnTransactionPaymentAdjustedTransactionFeePaidEvent,
  TransactionPaymentTransactionFeePaidEvent
} from '../types/generated/parachain-testnet/events'

export const handleFeePaid: IEventHandler = (ctx, event): IFeePaidData => {
  const data = new TransactionPaymentTransactionFeePaidEvent(ctx, event)
  if (data.isV8) {
    return {
      who: data.asV8.who,
      actualFee: data.asV8.actualFee,
      tip: data.asV8.tip,
      extrinsic: event.extrinsic
        ? {
            hash: event.extrinsic.hash
          }
        : undefined
    }
  } else {
    throw new UnknownVersionError(event.name)
  }
}

export const handleFeeAdjusted: IEventHandler = (ctx, event): IFeePaidAdjustedData => {
  const data = new AvnTransactionPaymentAdjustedTransactionFeePaidEvent(ctx, event)
  if (data.isV30) {
    return {
      who: data.asV30.who,
      fee: data.asV30.fee,
      extrinsic: event.extrinsic
        ? {
            hash: event.extrinsic.hash
          }
        : undefined
    }
  } else {
    throw new UnknownVersionError(event.name)
  }
}

export const feesEventHandlers: Record<
  TransactionPaymentFeesEventName,
  IEventHandler<IFeePaidData | IFeePaidAdjustedData>
> = {
  'TransactionPayment.TransactionFeePaid': handleFeePaid,
  'AvnTransactionPayment.AdjustedTransactionFeePaid': handleFeeAdjusted
}
