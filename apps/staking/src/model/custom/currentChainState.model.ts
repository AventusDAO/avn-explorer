import {
  Entity as Entity_,
  Column as Column_,
  PrimaryColumn as PrimaryColumn_,
  Index as Index_
} from 'typeorm'

@Entity_()
export class CurrentChainState {
  constructor(props?: Partial<CurrentChainState>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @Column_('timestamp with time zone', { nullable: false })
  timestamp!: Date

  @Index_()
  @Column_('int4', { nullable: false })
  blockNumber!: number
}
