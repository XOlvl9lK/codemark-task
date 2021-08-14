import { IsString, Matches, MinLength } from 'class-validator'

export class CreateUserDto {
  @IsString({ message: 'Должно быть строкой' })
  @MinLength(1, { message: 'Не должно быть пустым' })
  login: string

  @IsString({ message: 'Должно быть строкой' })
  @MinLength(1, { message: 'Не должно быть пустым' })
  name: string

  @IsString({ message: 'Должно быть строкой' })
  @MinLength(1, { message: 'Не должно быть пустым' })
  @Matches(/(?=.*[0-9])(?=.*[A-Z])|(?=.*[А-Я])/g, { message: 'Должен содержать хотя бы одну заглавную букву и одну цифру' })
  password: string

  roles?: string[]

  constructor(login: string, name: string, password: string, roles?: string[]) {
    this.login = login
    this.name = name
    this.password = password
    if (roles) {
      this.roles = roles
    }
  }
}

/*
export class MappedUser {
  login: string
  name: string
  password: string
  roles?: Role[]

  constructor(user: CreateUserDto, callback: (name: string) => Promise<Role>) {
    this.login = user.login
    this.name = user.name
    this.password = user.password
    this.fillRoles(user, callback)
  }

  async fillRoles(user, callback): Promise<void> {
    for (let role of user.roles) {
      let newRole = await callback(role)
      this.roles.push(newRole)
    }
  }
}
*/