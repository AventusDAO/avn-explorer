import assert from 'assert'
import {Chain, ChainContext, CallContext, Call, Result, Option} from './support'
import * as v4 from './v4'

export class SummaryRecordSummaryCalculationCall {
    private readonly _chain: Chain
    private readonly call: Call

    constructor(ctx: CallContext)
    constructor(ctx: ChainContext, call: Call)
    constructor(ctx: CallContext, call?: Call) {
        call = call || ctx.call
        assert(call.name === 'Summary.record_summary_calculation')
        this._chain = ctx._chain
        this.call = call
    }

    /**
     * # <weight>
     * Keys: V - Number of validators accounts
     *       R - Number of roots for a root range
     *  DbReads: `TotalIngresses`, `VotesRepository`, 3 * `NextBlockToProcess`, `PendingApproval`: O(1)
     *  DbWrites: `TotalIngresses`,`Roots`, `PendingApproval`, `VotesRepository`: O(1)
     *  Check summary is not approved by searching Roots double map by its primary key: O(R)
     *  avn pallet operations:
     *     - DbReads: `Validators`: O(1)
     *     - is_validator operation: O(V)
     *  ethereum_transactions pallet operations:
     *     - DbReads: `ReservedTransactions`, `Nonce`: O(1)
     *     - DbWrites: `ReservedTransactions`, `Nonce`: O(1)
     *  Emit events: `SummaryCalculated`: O(1)
     * Total Complexity: O(1 + V + R)
     * # </weight>
     */
    get isV4(): boolean {
        return this._chain.getCallHash('Summary.record_summary_calculation') === 'a3d0e21aab0e29b566317ddaf922d84abae370eda5b49eba9b6845b519421a82'
    }

    /**
     * # <weight>
     * Keys: V - Number of validators accounts
     *       R - Number of roots for a root range
     *  DbReads: `TotalIngresses`, `VotesRepository`, 3 * `NextBlockToProcess`, `PendingApproval`: O(1)
     *  DbWrites: `TotalIngresses`,`Roots`, `PendingApproval`, `VotesRepository`: O(1)
     *  Check summary is not approved by searching Roots double map by its primary key: O(R)
     *  avn pallet operations:
     *     - DbReads: `Validators`: O(1)
     *     - is_validator operation: O(V)
     *  ethereum_transactions pallet operations:
     *     - DbReads: `ReservedTransactions`, `Nonce`: O(1)
     *     - DbWrites: `ReservedTransactions`, `Nonce`: O(1)
     *  Emit events: `SummaryCalculated`: O(1)
     * Total Complexity: O(1 + V + R)
     * # </weight>
     */
    get asV4(): {newBlockNumber: number, rootHash: Uint8Array, ingressCounter: bigint, validator: v4.Validator, signature: Uint8Array} {
        assert(this.isV4)
        return this._chain.decodeCall(this.call)
    }
}
