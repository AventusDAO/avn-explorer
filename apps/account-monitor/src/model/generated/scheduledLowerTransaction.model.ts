import { Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_ } from "typeorm"
import * as marshal from "./marshal"

@Entity_()
export class ScheduledLowerTransaction {
    constructor(props?: Partial<ScheduledLowerTransaction>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("text", { nullable: false })
    name!: string

    @Column_("text", { nullable: false })
    scheduledTransactionName!: string

    @Column_("text", { nullable: true })
    from!: string | undefined | null

    @Column_("numeric", { transformer: marshal.bigintTransformer, nullable: true })
    amount!: bigint | undefined | null

    @Column_("int4", { nullable: true })
    lowerId!: number | undefined | null

    @Column_("text", { nullable: true })
    tokenId!: string | undefined | null

    @Column_("text", { nullable: true })
    t1Recipient!: string | undefined | null
}
