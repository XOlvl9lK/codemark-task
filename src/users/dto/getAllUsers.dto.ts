import { User } from '../users.model'

export class GetAllUsersDto {
  login: string
  name: string
  password: string

  constructor(user: User) {
    this.login = user.login
    this.name = user.name
    this.password = user.password
  }
}