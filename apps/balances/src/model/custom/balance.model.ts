import {
  Entity as Entity_,
  Column as Column_,
  PrimaryColumn as PrimaryColumn_,
  Index as Index_
} from 'typeorm'
import * as marshal from '../generated/marshal'

@Entity_()
export class Balance {
  constructor(props?: Partial<Balance>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: false,
    precision: 80,
    scale: 0
  })
  free!: bigint

  @Index_()
  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: false,
    precision: 80,
    scale: 0
  })
  reserved!: bigint

  @Index_()
  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: false,
    precision: 80,
    scale: 0
  })
  total!: bigint

  @Index_()
  @Column_('int4', { nullable: false })
  updatedAt!: number

  @Index_()
  @Column_('text', { nullable: false })
  accountId!: string
}
