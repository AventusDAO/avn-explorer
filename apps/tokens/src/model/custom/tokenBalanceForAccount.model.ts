import {
  Entity as Entity_,
  Column as Column_,
  PrimaryColumn as PrimaryColumn_,
  Index as Index_
} from 'typeorm'
import * as marshal from '../generated/marshal'

@Entity_()
export class TokenBalanceForAccount {
  constructor(props?: Partial<TokenBalanceForAccount>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_('numeric', {
    transformer: marshal.bigintTransformer,
    nullable: false,
    precision: 80,
    scale: 0
  })
  amount!: bigint

  @Index_()
  @Column_('text', { nullable: false })
  tokenId!: string

  @Index_()
  @Column_('text', { nullable: false })
  accountId!: string

  @Index_()
  @Column_('int4', { nullable: true })
  updatedAt!: number | undefined | null

  @Index_()
  @Column_('text', { nullable: false })
  reason!: string

  @Index_()
  @Column_('timestamp with time zone', { nullable: true })
  timestamp!: Date
}
