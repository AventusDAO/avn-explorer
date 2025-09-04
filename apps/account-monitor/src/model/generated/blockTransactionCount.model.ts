import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import { ObjectType, Field, Int } from "type-graphql"
import * as marshal from "./marshal"

@ObjectType()
@Entity_()
export class BlockTransactionCount {
    constructor(props?: Partial<BlockTransactionCount>) {
        Object.assign(this, props)
    }

    @Field(() => String)
    @PrimaryColumn_()
    id!: string

    @Index_()
    @Field(() => BigInt)
    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    blockNumber!: bigint

    @Index_()
    @Field(() => Date)
    @Column_("timestamp with time zone", {nullable: false})
    blockTimestamp!: Date

    @Field(() => Int)
    @Column_("int4", {nullable: false})
    totalSignedTransactions!: number
}
