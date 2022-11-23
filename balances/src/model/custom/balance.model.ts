import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"
import * as marshal from "../generated/marshal"

@Entity_()
export class Balance {
  constructor(props?: Partial<Balance>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false, precision:80, scale: 0})
  free!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false, precision:80, scale: 0})
  reserved!: bigint

  @Column_("numeric", {transformer: marshal.bigintTransformer, nullable: false, precision:80, scale: 0})
  total!: bigint

  @Column_("int4", {nullable: false})
  updatedAt!: number

  @Column_("text", {nullable: false})
  accountId!: string
}
