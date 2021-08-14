import { Test, TestingModule } from '@nestjs/testing'
import { UsersService } from '../users/users.service'
import { RolesService } from '../roles/roles.service'
import { getRepositoryToken } from '@nestjs/typeorm'
import { User } from '../users/users.model'
import { createConnection, Repository } from 'typeorm'
import { Role } from '../roles/roles.model'
import { GetAllUsersDto } from '../users/dto/getAllUsers.dto'
import { CreateUserDto } from '../users/dto/createUser.dto'
import { UsersController } from '../users/users.controller'

class MockService {
  testConnection: string = 'testConnection'
  mockUser: User
  mockUserWithoutRole: CreateUserDto
  mockUserWithRoles: CreateUserDto
  mockRole: Role
  mockGetAllUsersDto: GetAllUsersDto[] = []

  constructor() {
    this.mockRole = new Role()
    this.mockRole.id = 1
    this.mockRole.name = 'User'

    this.mockUser = new User()
    this.mockUser.login = 'Login'
    this.mockUser.name = 'Name'
    this.mockUser.password = 'Password'
    this.mockUser.roles = [this.mockRole]

    let userDto = new GetAllUsersDto(this.mockUser)
    this.mockGetAllUsersDto.push(userDto)

    this.mockUserWithoutRole = new CreateUserDto(this.mockUser.login, this.mockUser.name, this.mockUser.password)
    this.mockUserWithRoles = new CreateUserDto(this.mockUser.login, this.mockUser.name, this.mockUser.password, ['Администратор'])
  }

  async createTestingModuleForService(): Promise<TestingModule> {
   return await Test.createTestingModule({
      providers: [
        UsersService,
        RolesService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Role),
          useClass: Repository,
        },
      ],
    }).compile()
  }

  async createTestingModuleForController(): Promise<TestingModule> {
    return await Test.createTestingModule({
      providers: [UsersService],
      controllers: [UsersController]
    }).compile()
  }

  async createConnection() {
    return await createConnection({
      type: 'sqlite',
      database: ':memory:',
      dropSchema: true,
      entities: [User, Role],
      synchronize: true,
      logging: false,
      name: this.testConnection,
    })
  }

}

export default new MockService()