import { SubstrateBlock } from '@subsquid/substrate-processor'
import { Ctx } from './types'
import {
    PredictionMarketAssetTransfer,
    PredictionMarketCreation,
    PredictionMarketShareRedemption,
    PredictionMarketTokenWithdrawal,
    PredictionMarketTrade,
    Account
} from './model'
import { randomUUID } from 'crypto'

interface BaseCallData {
    blockNumber: bigint
    id: string
}

type CreateMarketHandler = (ctx: Ctx, args: any, baseData: BaseCallData, block: SubstrateBlock) => Promise<PredictionMarketCreation>
type TradeHandler = (ctx: Ctx, args: any, baseData: BaseCallData) => PredictionMarketTrade
type WithdrawHandler = (ctx: Ctx, args: any, baseData: BaseCallData) => PredictionMarketTokenWithdrawal
type RedeemHandler = (ctx: Ctx, args: any, baseData: BaseCallData) => PredictionMarketShareRedemption
type TransferHandler = (ctx: Ctx, args: any, baseData: BaseCallData) => Promise<PredictionMarketAssetTransfer>

const handleCreateMarket: CreateMarketHandler = async (ctx, args, baseData, block) => {
    const oracle = await getOrCreateAccount(ctx, args.oracle)

    // Get market data
    return new PredictionMarketCreation({
        ...baseData,
        amount: args.amount,
        baseAssetKind: args.baseAsset.__kind,
        baseAssetValue: args.baseAsset.value,
        creatorFee: args.creatorFee,
        disputeDuration: args.deadlines.disputeDuration,
        gracePeriod: args.deadlines.gracePeriod,
        oracleDuration: args.deadlines.oracleDuration,
        disputeMechanism: args.disputeMechanism?.__kind || '',
        marketType: args.marketType.__kind,
        oracle,
        spotPrices: args.spotPrices,
        swapFee: args.swapFee
    })
}

const handleTrade: TradeHandler = (ctx, args, baseData) => {
    return new PredictionMarketTrade({
        ...baseData,
        operationType: args.operationType,
        amountIn: args.amountIn,
        marketId: args.marketId,
        maxPrice: args.maxPrice,
        assetCount: args.assetCount,
        assetKind: args.asset.__kind,
        assetValue: args.asset.value,
        strategy: args.strategy.__kind
    })
}

const handleWithdraw: WithdrawHandler = (ctx, args, baseData) => {
    return new PredictionMarketTokenWithdrawal({
        ...baseData,
        amount: args.amount,
        token: args.token
    })
}

const handleRedeem: RedeemHandler = (ctx, args, baseData) => {
    return new PredictionMarketShareRedemption({
        ...baseData,
        marketId: args.marketId
    })
}

const handleTransfer: TransferHandler = async (ctx, args, baseData) => {
    const toAccount = await getOrCreateAccount(ctx, args.to)
    return new PredictionMarketAssetTransfer({
        ...baseData,
        amount: args.amount,
        to: toAccount,
        token: args.token,
    })
}

async function getOrCreateAccount(ctx: Ctx, address: string): Promise<Account> {
    let account = await ctx.store.get(Account, address)
    if (!account) {
        account = new Account({
            id: address,
            avtBalance: BigInt(0)
        })
        await ctx.store.save(account)
    }
    return account
}

const callHandlers = new Map<string, Function>([
    ['PredictionMarkets.create_market_and_deploy_pool', handleCreateMarket],
    ['PredictionMarkets.signed_create_market_and_deploy_pool', handleCreateMarket],
    ['HybridRouter.buy', handleTrade],
    ['HybridRouter.signed_buy', handleTrade],
    ['HybridRouter.sell', handleTrade],
    ['HybridRouter.signed_sell', handleTrade],
    ['PredictionMarkets.withdraw_tokens', handleWithdraw],
    ['PredictionMarkets.signed_withdraw_tokens', handleWithdraw],
    ['PredictionMarkets.redeem_shares', handleRedeem],
    ['PredictionMarkets.signed_redeem_shares', handleRedeem],
    ['PredictionMarkets.transfer_asset', handleTransfer],
    ['PredictionMarkets.signed_transfer_asset', handleTransfer]
])

export async function processPredictionMarketCall(ctx: Ctx, item: any, block: SubstrateBlock) {
    if (item.call.error || !item.call.success) {
        return
    }

    const callName = item.call.name
    const signedCallName = item.call.args?.call?.__kind ?
        `${item.call.args?.call?.__kind}.${item?.call?.args?.call?.value?.__kind}` : ''
    const effectiveCallName = signedCallName || callName

    const args = signedCallName ? item.call.args?.call?.value : item.call.args
    const baseData = {
        id: randomUUID(),
        blockNumber: BigInt(block.height),
    }

    const handler = callHandlers.get(effectiveCallName)
    if (!handler) {
        ctx.log.warn(`No handler found for call: ${effectiveCallName}`)
        return
    }

    try {

        const result = await handler(ctx, { ...args, operationType: effectiveCallName }, baseData, block)
        await ctx.store.save(result)
    } catch (error) {
        ctx.log.error(`Error processing prediction market call ${effectiveCallName}: ${error}`)
    }
}