import { BatchContext, BatchProcessorItem, SubstrateBlock } from '@subsquid/substrate-processor'
import { Store, TypeormDatabase } from '@subsquid/typeorm-store'
import { getProcessor } from '@avn/config'
import { Alert } from './model'
import { startMetricsServer } from './metrics-server'
import { updatePrometheusMetricsFull } from './prometheus-metrics'
import { MetricsUpdater } from './utils/metrics-updater'
import {
  ConfigService,
  ChainStorageService,
  BalanceMonitoringService,
  EventProcessingService,
  QueueMonitoringService
} from './services'
import {
  processInParallel,
  getDefaultConcurrency,
  CONCURRENCY_CONFIG,
  initializeProcessorServices,
  StandardErrorHandler,
  StandardLogger,
  type ProcessorInitContext,
  batchSave
} from '@avn/processor-common'
import { aggregateAlerts } from './utils/alert-aggregator'

startMetricsServer()

const processor = getProcessor().addEvent('*', {
  data: {
    event: {
      args: true,
      extrinsic: {
        hash: true
      }
    }
  }
} as const)

export type Item = BatchProcessorItem<typeof processor>
export type Ctx = BatchContext<Store, Item>

function createServices(store: Store, context: ProcessorInitContext) {
  const { serviceManager, log: logger } = context

  const configService = serviceManager.register('config', () => new ConfigService())
  const chainStorageService = serviceManager.register(
    'chainStorage',
    () => new ChainStorageService()
  )

  const balanceMonitoringService = new BalanceMonitoringService(
    store,
    logger,
    configService,
    chainStorageService
  )
  const eventProcessingService = new EventProcessingService(configService)
  const queueMonitoringService = new QueueMonitoringService(
    store,
    logger,
    configService,
    chainStorageService
  )

  return {
    configService,
    chainStorageService,
    balanceMonitoringService,
    eventProcessingService,
    queueMonitoringService
  }
}

function initializeServices(store: Store, log: any) {
  return initializeProcessorServices(store, log, context => createServices(store, context))
}

async function processBlock(
  ctx: Ctx,
  block: typeof ctx.blocks[0],
  services: {
    balanceMonitoringService: BalanceMonitoringService
    eventProcessingService: EventProcessingService
    queueMonitoringService: QueueMonitoringService
  },
  errorHandler: StandardErrorHandler,
  logger: StandardLogger,
  eventConcurrency: number
): Promise<{
  alerts: Alert[]
}> {
  const blockAlerts: Alert[] = []

  const [balanceResult, eventResult, queueResult] = await Promise.allSettled([
    services.balanceMonitoringService.processBlock(
      ctx as any, // ChainContext
      block.header,
      logger
    ),
    services.eventProcessingService.processBlockEventsParallel(
      block.items as any, // EventItem[]
      block.header,
      eventConcurrency,
      logger,
      errorHandler
    ),
    services.queueMonitoringService.processBlock(
      ctx as any, // ChainContext
      block.header,
      logger
    )
  ])

  if (balanceResult.status === 'fulfilled') {
    blockAlerts.push(...balanceResult.value.alerts)
  } else {
    errorHandler.handleBlockError(balanceResult.reason, block.header.height, 'balance monitoring')
  }

  if (eventResult.status === 'fulfilled') {
    blockAlerts.push(...eventResult.value.alerts)
  } else {
    errorHandler.handleBlockError(eventResult.reason, block.header.height, 'event processing')
  }

  if (queueResult.status === 'fulfilled') {
    blockAlerts.push(...queueResult.value.alerts)
  } else {
    errorHandler.handleBlockError(queueResult.reason, block.header.height, 'queue monitoring')
  }

  return { alerts: blockAlerts }
}

let metricsUpdater: MetricsUpdater | null = null

async function main(ctx: Ctx): Promise<void> {
  const services = initializeServices(ctx.store, ctx.log)
  const { serviceManager, logger, errorHandler } = services

  if (!metricsUpdater) {
    const fullUpdateInterval = parseInt(
      process.env.ALERTS_METRICS_FULL_UPDATE_INTERVAL || '100',
      10
    )
    metricsUpdater = new MetricsUpdater({ fullUpdateInterval })
  }

  if (!serviceManager.isInitialized('config')) {
    await serviceManager.initialize('config', async () => {
      services.configService.loadFromFile(logger)
    })
    logger.debug('Config loaded from file')

    try {
      await metricsUpdater.forceFullUpdate(ctx.store, logger)
      logger.debug('Initialized Prometheus metrics from database')
    } catch (error) {
      errorHandler.handleError(error, { operation: 'metrics initialization' }, { logLevel: 'warn' })
    }
  }

  const blockConcurrency = getDefaultConcurrency()
  const eventConcurrency = CONCURRENCY_CONFIG.EVENT_PROCESSING

  logger.debug(`Processing ${ctx.blocks.length} blocks with concurrency ${blockConcurrency}`)

  const blockResults = await processInParallel(
    ctx.blocks,
    async (block: typeof ctx.blocks[0]) => {
      return await processBlock(ctx, block, services, errorHandler, logger, eventConcurrency)
    },
    {
      concurrency: blockConcurrency,
      onError: (error: Error, block: typeof ctx.blocks[0]) => {
        errorHandler.handleBlockError(error, block.header.height)
      }
    }
  )

  const allAlerts = aggregateAlerts(blockResults)

  if (allAlerts.length > 0) {
    await batchSave(ctx.store, allAlerts, {
      batchSize: 1000,
      log: logger,
      entityName: 'alerts'
    })
    logger.debug(`Saved ${allAlerts.length} alerts in batches of 1000`)
  }

  if (metricsUpdater) {
    await metricsUpdater.updateMetrics(ctx.store, allAlerts, logger)
  }
}

processor.run(new TypeormDatabase(), main)
