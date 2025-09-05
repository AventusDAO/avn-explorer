import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"

@Entity_()
export class BlockTransactionTotal {
    constructor(props?: Partial<BlockTransactionTotal>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("numeric", {nullable: false})
    totalSignedTransactions!: number
}
