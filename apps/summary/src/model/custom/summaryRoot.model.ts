import { Entity as Entity_, Column as Column_, PrimaryColumn as PrimaryColumn_ } from 'typeorm'

@Entity_()
export class SummaryRoot {
  constructor(props?: Partial<SummaryRoot>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @Column_('text', { nullable: true })
  rootHash: string | undefined | null

  @Column_('int4', { nullable: true })
  fromBlock: number | undefined | null

  @Column_('int4', { nullable: false })
  toBlock!: number

  @Column_('bool', { nullable: false })
  isValidated!: boolean
}
