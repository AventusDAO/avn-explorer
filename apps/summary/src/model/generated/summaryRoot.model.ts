import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"

@Entity_()
export class SummaryRoot {
  constructor(props?: Partial<SummaryRoot>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @Column_("text", {nullable: true})
  rootHash!: string | undefined | null

  @Index_()
  @Column_("int4", {nullable: true})
  fromBlock!: number | undefined | null

  @Index_()
  @Column_("int4", {nullable: false})
  toBlock!: number

  @Index_()
  @Column_("bool", {nullable: false})
  isValidated!: boolean
}
