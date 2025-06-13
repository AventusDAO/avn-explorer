import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, ManyToOne as ManyToOne_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {Asset} from "./asset.model"

@Entity_()
export class Balance {
    constructor(props?: Partial<Balance>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @ManyToOne_(() => Asset, {nullable: true})
    asset!: Asset

    @Column_("text", {nullable: false})
    account!: string

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    free!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    reserved!: bigint

    @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false})
    updatedAt!: bigint
}
