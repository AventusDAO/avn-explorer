import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, OneToMany as OneToMany_} from "typeorm"
import {Balance} from "./balance.model"

@Entity_()
export class Asset {
    constructor(props?: Partial<Asset>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Column_("text", {nullable: false})
    symbol!: string

    @Column_("text", {nullable: false})
    ethAddress!: string

    @Column_("text", {nullable: true})
    name!: string | undefined | null

    @Column_("int4", {nullable: true})
    decimals!: number | undefined | null

    @Column_("bool", {nullable: false})
    baseAsset!: boolean

    @OneToMany_(() => Balance, e => e.asset)
    holders!: Balance[]
}
