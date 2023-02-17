import {
  Entity as Entity_,
  Column as Column_,
  PrimaryColumn as PrimaryColumn_,
  Index as Index_
} from 'typeorm'
import * as marshal from '../generated/marshal'

@Entity_()
export class ChainState {
  constructor(props?: Partial<ChainState>) {
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
  tokenBalance!: bigint

  @Index_()
  @Column_('int4', { nullable: false })
  tokenHolders!: number

  @Index_()
  @Column_('timestamp with time zone', { nullable: false })
  timestamp!: Date

  @Index_()
  @Column_('int4', { nullable: false })
  blockNumber!: number
}
