import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class PredictionMarketTokenWithdrawal {
    constructor(props?: Partial<PredictionMarketTokenWithdrawal>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    blockNumber!: bigint | undefined | null

    @Index_()
    @Column_("text", {nullable: true})
    amount!: string | undefined | null

    @Index_()
    @Column_("text", {nullable: true})
    token!: string | undefined | null
}
