import { ChainContext } from '../generated/parachain-dev/support'
import { EventItem } from '@subsquid/substrate-processor/lib/interfaces/dataSelection'

export type FeesEventItem =
  | EventItem<
      'TransactionPayment.TransactionFeePaid',
      {
        event: {
          args: true
          extrinsic: {
            hash: true
          }
          call: false
        }
      }
    >
  | EventItem<
      'AvnTransactionPayment.AdjustedTransactionFeePaid',
      {
        event: {
          args: true
          extrinsic: {
            hash: true
          }
          call: false
        }
      }
    >

export type IEventHandler<T = any> = (ctx: ChainContext, event: FeesEventItem['event']) => T
