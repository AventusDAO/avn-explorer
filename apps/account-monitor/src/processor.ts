import { getProcessor } from '@avn/config'

// Common configurations
const standardEventConfig = {
  data: {
    event: {
      args: true,
      extrinsic: {
        signature: true,
        hash: true,
        indexInBlock: true
      },
      call: { origin: true, args: true }
    }
  }
} as const

const standardCallConfig = {
  data: {
    call: {
      args: false,
      error: true,
      origin: true,
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
} as const

const addEventsWithConfig = (processor: any, events: any, config: any) => {
  events.forEach((event: any) => {
    processor.addEvent(event, config)
  })
  return processor
}

const processor = getProcessor()

// TokenManager events
const tokenManagerEvents = [
  'TokenManager.TokenTransferred',
  'TokenManager.TokenLifted',
  'TokenManager.TokenLowered',
  'TokenManager.AvtLowered',
  'TokenManager.AVTLifted',
  'TokenManager.LowerRequested'
]
addEventsWithConfig(processor, tokenManagerEvents, standardEventConfig)

const balancesEvents = [
  'Balances.Endowed',
  'Balances.Reserved',
  'Balances.Unreserved',
  'Balances.ReserveRepatriated',
  'Balances.Deposit',
  'Balances.Withdraw',
  'Balances.Slashed',
  'Balances.Transfer'
]
addEventsWithConfig(processor, balancesEvents, standardEventConfig)

const nftEventsWithIndex = [
  'NftManager.BatchCreated',
  'NftManager.SingleNftMinted',
  'NftManager.BatchNftMinted'
]

addEventsWithConfig(processor, nftEventsWithIndex, standardEventConfig)

const nftEvents = ['NftManager.FiatNftTransfer', 'NftManager.EthNftTransfer']
addEventsWithConfig(processor, nftEvents, standardEventConfig)

const schedulerEvents = ['Scheduler.Scheduled', 'Scheduler.Dispatched', 'Scheduler.Canceled']
const schedulerConfig = {
  data: {
    event: {
      args: true
    }
  }
} as const
addEventsWithConfig(processor, schedulerEvents, schedulerConfig)

const ethereumEvents = [
  'EthereumEvents.EthereumEventAdded',
  'EthereumEvents.NftEthereumEventAdded',
  'EthBridge.EventRejected',
  'EthBridge.EventAccepted'
]
const ethereumConfig = {
  data: {
    event: {
      args: true,
      extrinsic: true
    }
  }
} as const
addEventsWithConfig(processor, ethereumEvents, ethereumConfig)

export const predictionMarketCalls = [
  'PredictionMarkets.create_market_and_deploy_pool',
  'PredictionMarkets.signed_create_market_and_deploy_pool',
  'HybridRouter.buy',
  'HybridRouter.signed_buy',
  'HybridRouter.sell',
  'HybridRouter.signed_sell',
  'PredictionMarkets.redeem_shares',
  'PredictionMarkets.signed_redeem_shares',
  'PredictionMarkets.signed_transfer_asset',
  'PredictionMarkets.withdraw_tokens',
  'PredictionMarkets.signed_withdraw_tokens'
]
predictionMarketCalls.forEach(call => {
  processor.addCall(call, standardCallConfig)
})

processor.addCall('*', {
    data: {
      call: {
        args: true,
        error: true,
        origin: true,
        parent: false,
      },
    }
  } as const)

export default processor
