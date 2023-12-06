import {
  Entity as Entity_,
  Column as Column_,
  PrimaryColumn as PrimaryColumn_,
  OneToMany as OneToMany_
} from 'typeorm'
import { ObjectType, Field, ID } from 'type-graphql';
import { AccountToken } from './accountToken.model'

@ObjectType()
@Entity_()
export class Token {
  constructor(props?: Partial<Token>) {
    Object.assign(this, props)
  }

  @Field(() => String)
  @PrimaryColumn_()
  id!: string

  @Field(() => [AccountToken])
  @OneToMany_(() => AccountToken, e => e.token)
  accounts!: Promise<AccountToken[]>

  @Field(() => String)
  @Column_('text', { nullable: true })
  name!: string | undefined | null
}
