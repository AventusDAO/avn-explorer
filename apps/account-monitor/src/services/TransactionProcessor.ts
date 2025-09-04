import { SubstrateBlock } from '@subsquid/substrate-processor'
import { Ctx } from '../types'
import { BlockTransactionCount, TokenTransfer, NftTransfer } from '../model'

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
    const processedExtrinsics = new Set<string>()

    for (const item of block.items) {
      let extrinsicHash: string | null = null
      let origin: any = null
      let signature: any = null
      let extrinsicIndex = 0
      let callName = ''

      if (item.kind === 'call' && this.isSignedTransaction(item.call?.origin)) {
        extrinsicHash = item.extrinsic.hash
        signature = item.extrinsic.signature
        origin = item.call?.origin
        extrinsicIndex = item.extrinsic.indexInBlock || 0
        callName = item.call?.name || ''
      }

      if (extrinsicHash && !processedExtrinsics.has(extrinsicHash)) {
        const isSignedTransaction = this.isSignedTransaction(origin)

        if (isSignedTransaction) {
          signedTransactionCount++
          processedExtrinsics.add(extrinsicHash)
        }
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
    blockItems: any[]
  ): Promise<void> {
    try {
      const blockNumber = BigInt(block.height)
      const blockTimestamp = new Date(block.timestamp)

      if (!blockItems || !Array.isArray(blockItems)) {
        return
      }

      const existing = await ctx.store.findOne(BlockTransactionCount, {
        where: { id: blockNumber.toString() }
      })

      if (existing) {
        return
      }

      const result = this.countSignedTransactionsInBlock({
        items: blockItems
      })

      const { count: signedTransactionCount } = result

      const transactionCountRecord = new BlockTransactionCount({
        id: blockNumber.toString(),
        blockNumber,
        blockTimestamp,
        totalSignedTransactions: signedTransactionCount
      })

      try {
        if (signedTransactionCount) {
          await ctx.store.save(transactionCountRecord)
        }
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
