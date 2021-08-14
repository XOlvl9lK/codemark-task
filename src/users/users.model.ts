import { BaseEntity, Column, Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm'
import { Role } from '../roles/roles.model'

@Entity()
export class User extends BaseEntity {
  @PrimaryColumn({
    type: 'varchar',
    unique: true,
    nullable: false
  })
  login: string

  @Column({
    type: 'varchar',
    nullable: false
  })
  name: string

  @Column({
    type: 'varchar',
    nullable: false
  })
  password: string

  @ManyToMany(() => Role, role => role.users, {
    cascade: true
  })
  @JoinTable()
  roles: Role[]
}