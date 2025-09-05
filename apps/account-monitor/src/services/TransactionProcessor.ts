import { SubstrateBlock } from '@subsquid/substrate-processor'
import { Ctx } from '../types'
import { BlockTransactionCount, BlockTransactionTotal } from '../model'
import { DB_TOTAL_ID } from '../constants'

export interface SignedTransactionInfo {
  blockNumber: bigint
  blockTimestamp: Date
  signedTransactionCount: number
}

export interface TransactionDetails {
  extrinsicHash: string
  extrinsicIndex: number
  callName?: string
  originType?: string
  signatureType?: string
  pallet?: string
  method?: string
  isSignedTransaction: boolean
}

export class TransactionProcessor {
  static countSignedTransactionsInBlock(block: any): {
    count: number
  } {
    if (!block.items || !Array.isArray(block.items)) {
      return {
        count: 0
      }
    }

    let signedTransactionCount = 0

    for (const item of block.items) {
      const isSignedTransaction = this.isSignedTransaction(item.call?.origin)
      if (isSignedTransaction) {
        signedTransactionCount++
      }
    }

    return {
      count: signedTransactionCount
    }
  }

  private static isSignedTransaction(origin: any): boolean {
    if (origin?.value?.__kind === 'Signed') {
      return true
    }

    if (origin?.__kind === 'Signed') {
      return true
    }

    if (origin?.value?.value?.__kind === 'Signed') {
      return true
    }

    return false
  }

  static async processBlockTransactionCount(
    ctx: Ctx,
    block: SubstrateBlock,
    blockItems: unknown[]
  ): Promise<void> {
    try {
      const blockNumber = BigInt(block.height)
      const blockTimestamp = new Date(block.timestamp)

      if (!Array.isArray(blockItems) || blockItems.length === 0) {
        return
      }
      const existing = await ctx.store.findOne(BlockTransactionCount, {
        where: { id: blockNumber.toString() }
      })
      if (existing) {
        return
      }

      const { count: signedTransactionCount } = this.countSignedTransactionsInBlock({
        items: blockItems
      })

      if (!signedTransactionCount || signedTransactionCount == 0) {
        return
      }

      const transactionCountRecord = new BlockTransactionCount({
        id: blockNumber.toString(),
        blockNumber,
        blockTimestamp,
        totalSignedTransactions: signedTransactionCount
      })

      try {
        await ctx.store.save(transactionCountRecord)

        let totalRecord = await ctx.store.findOne(BlockTransactionTotal, {
          where: { id: DB_TOTAL_ID }
        })

        if (!totalRecord) {
          totalRecord = new BlockTransactionTotal({
            id: DB_TOTAL_ID,
            totalSignedTransactions: 0
          })
        }

        totalRecord.totalSignedTransactions += signedTransactionCount
        await ctx.store.save(totalRecord)
      } catch (saveError) {
        if (saveError instanceof Error && saveError.message.includes('duplicate')) {
          ctx.log
            .child('transaction-count')
            .debug(`Block ${blockNumber} transaction count already exists (duplicate save attempt)`)
        } else {
          throw saveError
        }
      }
    } catch (error) {
      ctx.log.error(`Error processing transaction count for block ${block.height}: ${error}`)
    }
  }
}
