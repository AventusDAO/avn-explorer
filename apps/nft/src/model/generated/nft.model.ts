import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"
import * as marshal from "./marshal"
import {NftRoyalty} from "./_nftRoyalty"

@Entity_()
export class Nft {
    constructor(props?: Partial<Nft>) {
        Object.assign(this, props)
    }

    @PrimaryColumn_()
    id!: string

    @Index_()
    @Column_("text", {nullable: false})
    owner!: string

    @Column_("int4", {nullable: false})
    mintBlock!: number

    @Column_("timestamp with time zone", {nullable: false})
    mintDate!: Date

    @Column_("text", {nullable: true})
    t1Authority!: string | undefined | null

    @Column_("jsonb", {transformer: {to: obj => obj == null ? undefined : obj.map((val: any) => val == null ? undefined : val.toJSON()), from: obj => obj == null ? undefined : marshal.fromList(obj, val => val == null ? undefined : new NftRoyalty(undefined, val))}, nullable: true})
    royalties!: (NftRoyalty | undefined | null)[] | undefined | null

    @Column_("text", {nullable: true})
    uniqueExternalRef!: string | undefined | null
}
