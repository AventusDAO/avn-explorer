import assert from "assert"
import * as marshal from "./marshal"

export class NftRoyaltyRate {
    private _partsPerMillion!: bigint | undefined | null

    constructor(props?: Partial<Omit<NftRoyaltyRate, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._partsPerMillion = json.partsPerMillion == null ? undefined : marshal.bigint.fromJSON(json.partsPerMillion)
        }
    }

    get partsPerMillion(): bigint | undefined | null {
        return this._partsPerMillion
    }

    set partsPerMillion(value: bigint | undefined | null) {
        this._partsPerMillion = value
    }

    toJSON(): object {
        return {
            partsPerMillion: this.partsPerMillion == null ? undefined : marshal.bigint.toJSON(this.partsPerMillion),
        }
    }
}
