import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class CrossChainTransactionEvent {
    constructor(props?: Partial<TransactionEvent>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("text", {nullable: false})
    name!: string

    @Column_("jsonb", {nullable: false})
    args!: unknown

    @Column_("text", {nullable: false})
    ethEventIdSignature!: string

    @Column_("text", {nullable: false})
    ethEventIdTransactionHash!: string

    @Column_("text", {nullable: false})
    extrinsicHash!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    extrinsicIndexInBlock!: bigint

    @Column_("bool", {nullable: false})
    extrinsicSuccess!: boolean

    @Index_()
    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    extrinsicBlockNumber!: bigint
}
