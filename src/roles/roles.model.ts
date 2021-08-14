import { BaseEntity, Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm'
import { User } from '../users/users.model'

@Entity()
export class Role extends BaseEntity {
  @PrimaryGeneratedColumn({
    type: 'int'
  })
  id: number

  @Column({
    type: 'varchar',
    unique: true,
    nullable: false
  })
  name: string

  @ManyToMany(() => User, user => user.roles)
  users: User[]
}