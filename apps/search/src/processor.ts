import { getProcessor } from '@avn/config'
import { ProxyCallArgs } from '@avn/types'
import { ChainGen, getChainGen } from '@avn/utils'
import {
  BatchContext,
  BatchProcessorItem,
  SubstrateBlock,
  BatchBlock
} from '@subsquid/substrate-processor'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import { getElasticSearch } from './elastic-search'
import { SearchBlock, SearchEvent, SearchExtrinsic } from './elastic-search/types'
import { argsSearchableSections, normalizeEventArgValues } from './utils'

type Item = BatchProcessorItem<typeof processor>
export type Context = BatchContext<Store, Item>

const processor = getProcessor()
  .addCall('AvnProxy.proxy', {
    data: {
      call: {
        args: true,
        error: true,
        origin: false,
        parent: false // fetch parent call data
      },
      extrinsic: {
        signature: true,
        success: true,
        fee: false,
        tip: false,
        call: false,
        calls: false,
        events: false,
        hash: true
      }
    }
  } as const)
  .addCall('NftManager.proxy', {
    data: {
      call: {
        args: true,
        error: true,
        origin: false,
        parent: false // fetch parent call data
      },
      extrinsic: {
        signature: true,
        success: true,
        fee: false,
        tip: false,
        call: false,
        calls: false,
        events: false,
        hash: true
      }
    }
  } as const)
  // NOTE: keep the data as small as possible for wildcard '*' queries.
  // otherwise you might overload the archive gateway and see pool timeouts
  .addCall('*', {
    data: {
      call: {
        args: false,
        error: true,
        origin: false,
        parent: false
      },
      extrinsic: {
        signature: true,
        success: true,
        fee: false,
        tip: false,
        call: false,
        calls: false,
        events: false,
        hash: true
      }
    }
  } as const)
  .addEvent('*', {
    data: {
      event: {
        args: true,
        extrinsic: {
          signature: true,
          success: true,
          fee: false,
          tip: false,
          call: false,
          calls: false,
          events: false,
          hash: true
        },
        call: {
          args: false,
          error: true,
          origin: false,
          parent: false
        }
      }
    }
  })

const mapChainGen = (block: BatchBlock<Item>): ChainGen => {
  const [specName, specVersion] = block.header.specId.split('@')
  return getChainGen({ specName, specVersion: Number(specVersion) })
}

const mapBlockBatch = (block: BatchBlock<Item>, extrinsics: SearchExtrinsic[]): SearchBlock => {
  const blockHeader: SubstrateBlock = block.header
  const { id, height, hash, timestamp } = blockHeader
  const chainGen = mapChainGen(block)

  return {
    refId: id,
    timestamp,
    chainGen,
    hash,
    height,
    extrCount: extrinsics.length,
    signedExtrCount: extrinsics.filter(e => e.isSigned).length
  }
}

const mapExtrinsics = (block: BatchBlock<Item>): SearchExtrinsic[] => {
  const { height: blockHeight, timestamp } = block.header
  const chainGen = mapChainGen(block)

  const innerCallFailedEvents = new Set(
    block.items
      .filter(
        (item: any) => item.kind === 'event' && item.event.name === 'AvnProxy.InnerCallFailed'
      )
      .map((event: any) => event.event.call?.id)
  )

  return block.items
    .reduce((acc: any, item: any) => {
      if (item.kind !== 'call') return acc
      return acc.some((i: any) => i.extrinsic.id === item.extrinsic.id) ? acc : [...acc, item]
    }, [])
    .map((item: any) => {
      const [section, method] = item.call.name.split('.')
      const { signature, success: isProcessed, hash, id: refId } = item.extrinsic
      const isSuccess = isProcessed && !innerCallFailedEvents.has(item.call.id)

      let proxyData = {}
      if (item.name === 'AvnProxy.proxy') {
        const args = item.call.args as ProxyCallArgs<unknown>
        const { call, paymentInfo } = args
        proxyData = {
          proxySigner: call.value.proof.signer,
          proxyRelayer: call.value.proof.relayer,
          proxyCallSection: call.__kind,
          proxyCallMethod: call.value.__kind,
          proxyRecipient: paymentInfo?.recipient,
          proxyPayer: paymentInfo?.payer,
          from: call.value?.from,
          to: call.value?.to
        }
      } else if (item.name === 'NftManager.proxy') {
        // TODO: remove this block when highlander is decomissioned
        const args = item.call.args as ProxyCallArgs<unknown>
        if (args) {
          const { call, paymentInfo } = args
          if (['signed_mint_batch_nft', 'signed_transfer_fiat_nft'].includes(call.value.__kind)) {
            proxyData = {
              proxySigner: call.value.proof.signer,
              proxyRelayer: call.value.proof.relayer,
              proxyCallSection: call.__kind,
              proxyCallMethod: call.value.__kind,
              nftManagerProxyOwner: call.value?.t2TransferToPublicKey,
              from: call.value?.from,
              to: call.value?.to
            }
          }
        }
      }

      return {
        refId,
        timestamp,
        chainGen,
        blockHeight,
        hash,
        section,
        method,
        isSigned: !!signature,
        isProcessed,
        isSuccess,
        signer: signature?.address?.value,
        nonce: signature?.signedExtensions?.CheckNonce,
        ...proxyData
      }
    })
}

const mapEvents = (block: BatchBlock<Item>, _ctx: Context): SearchEvent[] => {
  const blockHeader: SubstrateBlock = block.header
  const { height, timestamp } = blockHeader
  const chainGen = mapChainGen(block)

  return block.items
    .filter(item => item.kind === 'event')
    .map(item => {
      // just for type safety
      if (item.kind !== 'event') throw new Error(`item must be of 'event' kind`)
      const _name = item.event.name
      const [section, name] = _name.split('.')
      const args = item.event.args
      let argValues: string[] | undefined

      if (!!args && argsSearchableSections.includes(section)) {
        argValues = normalizeEventArgValues(args)
        // _ctx.log.debug(
        //   `event ${_name}\nargs: ${JSON.stringify(args)}\ndataSearch: ${JSON.stringify(argValues)}`
        // )
      }
      return {
        refId: item.event.id,
        timestamp,
        chainGen,
        blockHeight: height,
        section,
        name,
        __argValues: argValues
      }
    })
}

const handleBatch = async (ctx: Context): Promise<void> => {
  const elasticSearch = getElasticSearch()

  const batchedBlocks: SearchBlock[] = []
  const batchedExtrinsics: SearchExtrinsic[] = []
  const batchedEvents: SearchEvent[] = []

  ctx.blocks.forEach(batchBlock => {
    const events = mapEvents(batchBlock, ctx)
    const extrinsics = mapExtrinsics(batchBlock)
    const block = mapBlockBatch(batchBlock, extrinsics)

    batchedBlocks.push(block)
    batchedExtrinsics.push(...extrinsics)
    batchedEvents.push(...events)
  })

  await elasticSearch.storeBatch(batchedBlocks, batchedExtrinsics, batchedEvents)
}

const main = async (): Promise<void> => {
  const elasticSearch = getElasticSearch()

  const isSetUp = await elasticSearch.isSetUp()
  if (!isSetUp) {
    await elasticSearch.setupIndexes()
  }

  processor.run(new TypeormDatabase(), handleBatch)
}

void main()
