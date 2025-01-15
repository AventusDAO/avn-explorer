import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class PredictionMarketTrade {
    constructor(props?: Partial<PredictionMarketTrade>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: true})
    blockNumber!: bigint | undefined | null

    @Index_()
    @Column_("text", {nullable: false})
    operationType!: string

    @Index_()
    @Column_("text", {nullable: true})
    amountIn!: string | undefined | null

    @Index_()
    @Column_("text", {nullable: true})
    marketId!: string | undefined | null

    @Column_("text", {nullable: true})
    maxPrice!: string | undefined | null

    @Column_("int4", {nullable: true})
    assetCount!: number | undefined | null

    @Index_()
    @Column_("text", {nullable: true})
    assetKind!: string | undefined | null

    @Column_("text", {array: true, nullable: true})
    assetValue!: (string)[] | undefined | null

    @Index_()
    @Column_("text", {nullable: true})
    strategy!: string | undefined | null
}
