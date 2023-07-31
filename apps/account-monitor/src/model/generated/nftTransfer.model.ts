import {
  Entity as Entity_,
  Column as Column_,
  PrimaryGeneratedColumn as PrimaryColumn_,
  Index as Index_,
  ManyToOne as ManyToOne_
} from 'typeorm'
import * as marshal from './marshal'
import { Account } from './account.model'
import { Nft } from './nft.model'

@Entity_()
export class NftTransfer {
  constructor(props?: Partial<NftTransfer>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Index_()
  @Column_('int4', { nullable: false })
  blockNumber!: number

  @Index_()
  @Column_('timestamp with time zone', { nullable: false })
  timestamp!: Date

  @Index_()
  @Column_('text', { nullable: true })
  extrinsicHash!: string | undefined | null

  @Index_()
  @ManyToOne_(() => Account, { nullable: true })
  from!: Account

  @Index_()
  @ManyToOne_(() => Account, { nullable: true })
  to!: Account

  @Index_()
  @ManyToOne_(() => Nft, { nullable: true })
  nft!: Nft

  @Index_()
  @Column_('text', { nullable: false })
  pallet!: string

  @Index_()
  @Column_('text', { nullable: false })
  method!: string
}
