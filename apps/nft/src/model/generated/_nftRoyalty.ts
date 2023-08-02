import assert from "assert"
import * as marshal from "./marshal"
import {NftRoyaltyRate} from "./_nftRoyaltyRate"

export class NftRoyalty {
    private _rate!: NftRoyaltyRate
    private _recipientT1Address!: string

    constructor(props?: Partial<Omit<NftRoyalty, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._rate = new NftRoyaltyRate(undefined, marshal.nonNull(json.rate))
            this._recipientT1Address = marshal.string.fromJSON(json.recipientT1Address)
        }
    }

    get rate(): NftRoyaltyRate {
        assert(this._rate != null, 'uninitialized access')
        return this._rate
    }

    set rate(value: NftRoyaltyRate) {
        this._rate = value
    }

    get recipientT1Address(): string {
        assert(this._recipientT1Address != null, 'uninitialized access')
        return this._recipientT1Address
    }

    set recipientT1Address(value: string) {
        this._recipientT1Address = value
    }

    toJSON(): object {
        return {
            rate: this.rate.toJSON(),
            recipientT1Address: this.recipientT1Address,
        }
    }
}
