import {Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_, Index as Index_} from "typeorm"

@Entity_()
export class ExtrinsicError {
  constructor(props?: Partial<ExtrinsicError>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @Column_("text", {nullable: false})
  extrinsicHash!: string

  @Column_("text", {nullable: false})
  errorName!: string
}
