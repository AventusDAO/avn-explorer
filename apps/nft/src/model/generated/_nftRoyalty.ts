import assert from "assert"
import * as marshal from "./marshal"
import {NftRoyaltyRate} from "./_nftRoyaltyRate"

export class NftRoyalty {
    private _rate!: NftRoyaltyRate | undefined | null
    private _recipientT1Address!: string | undefined | null

    constructor(props?: Partial<Omit<NftRoyalty, 'toJSON'>>, json?: any) {
        Object.assign(this, props)
        if (json != null) {
            this._rate = json.rate == null ? undefined : new NftRoyaltyRate(undefined, json.rate)
            this._recipientT1Address = json.recipientT1Address == null ? undefined : marshal.string.fromJSON(json.recipientT1Address)
        }
    }

    get rate(): NftRoyaltyRate | undefined | null {
        return this._rate
    }

    set rate(value: NftRoyaltyRate | undefined | null) {
        this._rate = value
    }

    get recipientT1Address(): string | undefined | null {
        return this._recipientT1Address
    }

    set recipientT1Address(value: string | undefined | null) {
        this._recipientT1Address = value
    }

    toJSON(): object {
        return {
            rate: this.rate == null ? undefined : this.rate.toJSON(),
            recipientT1Address: this.recipientT1Address,
        }
    }
}
