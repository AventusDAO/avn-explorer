import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_} from "typeorm"

@Entity_()
export class SummaryRoot {
  constructor(props?: Partial<SummaryRoot>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_("text", {nullable: false})
  rootHash!: string

  @Column_("int4", {nullable: false})
  fromBlock!: number

  @Column_("int4", {nullable: false})
  toBlock!: number

  @Column_("bool", {nullable: false})
  isValidated!: boolean
}
