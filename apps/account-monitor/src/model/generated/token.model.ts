import {
  Entity as Entity_,
  Column as Column_,
  PrimaryColumn as PrimaryColumn_,
  OneToMany as OneToMany_
} from 'typeorm'
import { AccountToken } from './accountToken.model'

@Entity_()
export class Token {
  constructor(props?: Partial<Token>) {
    Object.assign(this, props)
  }

  @PrimaryColumn_()
  id!: string

  @OneToMany_(() => AccountToken, e => e.token)
  accounts!: Promise<AccountToken[]>

  @Column_('text', { nullable: true })
  name!: string | undefined | null
}
