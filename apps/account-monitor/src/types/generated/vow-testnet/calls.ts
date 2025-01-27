import assert from 'assert'
import {Chain, ChainContext, CallContext, Call, Result, Option} from './support'
import * as v13 from './v13'
import * as v14 from './v14'

export class HybridRouterBuyCall {
    private readonly _chain: Chain
    private readonly call: Call

    constructor(ctx: CallContext)
    constructor(ctx: ChainContext, call: Call)
    constructor(ctx: CallContext, call?: Call) {
        call = call || ctx.call
        assert(call.name === 'HybridRouter.buy')
        this._chain = ctx._chain
        this.call = call
    }

    /**
     * See [`Pallet::buy`].
     */
    get isV13(): boolean {
        return this._chain.getCallHash('HybridRouter.buy') === '57c474d93bb675ac380cb4dcb1c1e2ca6bf1cd04e93b030ceae1ec8e21ea15ac'
    }

    /**
     * See [`Pallet::buy`].
     */
    get asV13(): {marketId: bigint, assetCount: number, asset: v13.Asset, amountIn: bigint, maxPrice: bigint, orders: bigint[], strategy: v13.Strategy} {
        assert(this.isV13)
        return this._chain.decodeCall(this.call)
    }
}

export class HybridRouterSellCall {
    private readonly _chain: Chain
    private readonly call: Call

    constructor(ctx: CallContext)
    constructor(ctx: ChainContext, call: Call)
    constructor(ctx: CallContext, call?: Call) {
        call = call || ctx.call
        assert(call.name === 'HybridRouter.sell')
        this._chain = ctx._chain
        this.call = call
    }

    /**
     * See [`Pallet::sell`].
     */
    get isV13(): boolean {
        return this._chain.getCallHash('HybridRouter.sell') === '8de08a3bd7bc8610a95bdb5eaaef06cefd39b856d1e6ece730332544c7ee3656'
    }

    /**
     * See [`Pallet::sell`].
     */
    get asV13(): {marketId: bigint, assetCount: number, asset: v13.Asset, amountIn: bigint, minPrice: bigint, orders: bigint[], strategy: v13.Strategy} {
        assert(this.isV13)
        return this._chain.decodeCall(this.call)
    }
}

export class HybridRouterSignedBuyCall {
    private readonly _chain: Chain
    private readonly call: Call

    constructor(ctx: CallContext)
    constructor(ctx: ChainContext, call: Call)
    constructor(ctx: CallContext, call?: Call) {
        call = call || ctx.call
        assert(call.name === 'HybridRouter.signed_buy')
        this._chain = ctx._chain
        this.call = call
    }

    /**
     * See [`Pallet::signed_buy`].
     */
    get isV13(): boolean {
        return this._chain.getCallHash('HybridRouter.signed_buy') === '8ac235682e014ccfe9c9652930099684aab48315884aff209d8e27cc1b21cf55'
    }

    /**
     * See [`Pallet::signed_buy`].
     */
    get asV13(): {proof: v13.Proof, marketId: bigint, assetCount: number, asset: v13.Asset, amountIn: bigint, maxPrice: bigint, orders: bigint[], strategy: v13.Strategy} {
        assert(this.isV13)
        return this._chain.decodeCall(this.call)
    }
}

export class HybridRouterSignedSellCall {
    private readonly _chain: Chain
    private readonly call: Call

    constructor(ctx: CallContext)
    constructor(ctx: ChainContext, call: Call)
    constructor(ctx: CallContext, call?: Call) {
        call = call || ctx.call
        assert(call.name === 'HybridRouter.signed_sell')
        this._chain = ctx._chain
        this.call = call
    }

    /**
     * See [`Pallet::signed_sell`].
     */
    get isV13(): boolean {
        return this._chain.getCallHash('HybridRouter.signed_sell') === '2d55fd59b45b27800f1e547f109ef202241b131998895e5f2416571aa2683d27'
    }

    /**
     * See [`Pallet::signed_sell`].
     */
    get asV13(): {proof: v13.Proof, marketId: bigint, assetCount: number, asset: v13.Asset, amountIn: bigint, minPrice: bigint, orders: bigint[], strategy: v13.Strategy} {
        assert(this.isV13)
        return this._chain.decodeCall(this.call)
    }
}

export class PredictionMarketsCreateMarketAndDeployPoolCall {
    private readonly _chain: Chain
    private readonly call: Call

    constructor(ctx: CallContext)
    constructor(ctx: ChainContext, call: Call)
    constructor(ctx: CallContext, call?: Call) {
        call = call || ctx.call
        assert(call.name === 'PredictionMarkets.create_market_and_deploy_pool')
        this._chain = ctx._chain
        this.call = call
    }

    /**
     * See [`Pallet::create_market_and_deploy_pool`].
     */
    get isV13(): boolean {
        return this._chain.getCallHash('PredictionMarkets.create_market_and_deploy_pool') === '17a3a6dd3f9c33f881cc9039dc51edfa4d3b40ac0422d452109b5c579864e427'
    }

    /**
     * See [`Pallet::create_market_and_deploy_pool`].
     */
    get asV13(): {baseAsset: v13.Asset, creatorFee: number, oracle: Uint8Array, period: v13.MarketPeriod, deadlines: v13.Deadlines, metadata: v13.MultiHash, marketType: v13.MarketType, disputeMechanism: (v13.MarketDisputeMechanism | undefined), amount: bigint, spotPrices: bigint[], swapFee: bigint} {
        assert(this.isV13)
        return this._chain.decodeCall(this.call)
    }
}

export class PredictionMarketsRedeemSharesCall {
    private readonly _chain: Chain
    private readonly call: Call

    constructor(ctx: CallContext)
    constructor(ctx: ChainContext, call: Call)
    constructor(ctx: CallContext, call?: Call) {
        call = call || ctx.call
        assert(call.name === 'PredictionMarkets.redeem_shares')
        this._chain = ctx._chain
        this.call = call
    }

    /**
     * See [`Pallet::redeem_shares`].
     */
    get isV13(): boolean {
        return this._chain.getCallHash('PredictionMarkets.redeem_shares') === 'b56842a00d00b24c300d8cd4359235b469945c309694d455d2ba2bd1de5d0d4e'
    }

    /**
     * See [`Pallet::redeem_shares`].
     */
    get asV13(): {marketId: bigint} {
        assert(this.isV13)
        return this._chain.decodeCall(this.call)
    }
}

export class PredictionMarketsSignedCreateMarketAndDeployPoolCall {
    private readonly _chain: Chain
    private readonly call: Call

    constructor(ctx: CallContext)
    constructor(ctx: ChainContext, call: Call)
    constructor(ctx: CallContext, call?: Call) {
        call = call || ctx.call
        assert(call.name === 'PredictionMarkets.signed_create_market_and_deploy_pool')
        this._chain = ctx._chain
        this.call = call
    }

    /**
     * See [`Pallet::signed_create_market_and_deploy_pool`].
     */
    get isV13(): boolean {
        return this._chain.getCallHash('PredictionMarkets.signed_create_market_and_deploy_pool') === 'ff175d22b1e766284448b3fc703dd2827263e8e9d9ed4704ce21f34700f535a3'
    }

    /**
     * See [`Pallet::signed_create_market_and_deploy_pool`].
     */
    get asV13(): {proof: v13.Proof, baseAsset: v13.Asset, creatorFee: number, oracle: Uint8Array, period: v13.MarketPeriod, deadlines: v13.Deadlines, metadata: v13.MultiHash, marketType: v13.MarketType, disputeMechanism: (v13.MarketDisputeMechanism | undefined), amount: bigint, spotPrices: bigint[], swapFee: bigint} {
        assert(this.isV13)
        return this._chain.decodeCall(this.call)
    }
}

export class PredictionMarketsSignedRedeemSharesCall {
    private readonly _chain: Chain
    private readonly call: Call

    constructor(ctx: CallContext)
    constructor(ctx: ChainContext, call: Call)
    constructor(ctx: CallContext, call?: Call) {
        call = call || ctx.call
        assert(call.name === 'PredictionMarkets.signed_redeem_shares')
        this._chain = ctx._chain
        this.call = call
    }

    /**
     * See [`Pallet::signed_redeem_shares`].
     */
    get isV14(): boolean {
        return this._chain.getCallHash('PredictionMarkets.signed_redeem_shares') === 'cacf8621fa483ad6f9e177fb2f09fbc9851d04ec5662d979bbbeb1fe3b8457d3'
    }

    /**
     * See [`Pallet::signed_redeem_shares`].
     */
    get asV14(): {proof: v14.Proof, marketId: bigint} {
        assert(this.isV14)
        return this._chain.decodeCall(this.call)
    }
}

export class PredictionMarketsSignedTransferAssetCall {
    private readonly _chain: Chain
    private readonly call: Call

    constructor(ctx: CallContext)
    constructor(ctx: ChainContext, call: Call)
    constructor(ctx: CallContext, call?: Call) {
        call = call || ctx.call
        assert(call.name === 'PredictionMarkets.signed_transfer_asset')
        this._chain = ctx._chain
        this.call = call
    }

    /**
     * See [`Pallet::signed_transfer_asset`].
     */
    get isV14(): boolean {
        return this._chain.getCallHash('PredictionMarkets.signed_transfer_asset') === 'd5c4fe47f09333ba646c1cfcc56de196ec9b66c6ba580e7e2aa05eb5b1c9548a'
    }

    /**
     * See [`Pallet::signed_transfer_asset`].
     */
    get asV14(): {proof: v14.Proof, token: Uint8Array, to: Uint8Array, amount: bigint} {
        assert(this.isV14)
        return this._chain.decodeCall(this.call)
    }
}

export class PredictionMarketsSignedWithdrawTokensCall {
    private readonly _chain: Chain
    private readonly call: Call

    constructor(ctx: CallContext)
    constructor(ctx: ChainContext, call: Call)
    constructor(ctx: CallContext, call?: Call) {
        call = call || ctx.call
        assert(call.name === 'PredictionMarkets.signed_withdraw_tokens')
        this._chain = ctx._chain
        this.call = call
    }

    /**
     * See [`Pallet::signed_withdraw_tokens`].
     */
    get isV13(): boolean {
        return this._chain.getCallHash('PredictionMarkets.signed_withdraw_tokens') === '4c147269d4fe5461d0f0f2ac722fcb74c356cbef2c8fe35d39c556586f0b803b'
    }

    /**
     * See [`Pallet::signed_withdraw_tokens`].
     */
    get asV13(): {proof: v13.Proof, token: Uint8Array, amount: bigint} {
        assert(this.isV13)
        return this._chain.decodeCall(this.call)
    }
}

export class PredictionMarketsWithdrawTokensCall {
    private readonly _chain: Chain
    private readonly call: Call

    constructor(ctx: CallContext)
    constructor(ctx: ChainContext, call: Call)
    constructor(ctx: CallContext, call?: Call) {
        call = call || ctx.call
        assert(call.name === 'PredictionMarkets.withdraw_tokens')
        this._chain = ctx._chain
        this.call = call
    }

    /**
     * See [`Pallet::withdraw_tokens`].
     */
    get isV13(): boolean {
        return this._chain.getCallHash('PredictionMarkets.withdraw_tokens') === '1dd51092fece0292aef750dbe026fafeecf5860d593d6cdbabc87ed672b5eb09'
    }

    /**
     * See [`Pallet::withdraw_tokens`].
     */
    get asV13(): {token: Uint8Array, amount: bigint} {
        assert(this.isV13)
        return this._chain.decodeCall(this.call)
    }
}
