import { UsersService } from './users.service'
import { getConnection, getRepository, Repository } from 'typeorm'
import { User } from './users.model'
import { TestingModule } from '@nestjs/testing'
import { Role } from '../roles/roles.model'
import { RolesService } from '../roles/roles.service'
import { HttpException } from '@nestjs/common'
import MockService from '../mock/MockService'

describe('UsersService', () => {
  let usersService: UsersService
  let rolesService: RolesService
  let userRepository: Repository<User>
  let roleRepository: Repository<Role>

  beforeEach(async () => {
    const module: TestingModule = await MockService.createTestingModuleForService()

    let connection = await MockService.createConnection()

    userRepository = getRepository(User, MockService.testConnection)
    roleRepository = getRepository(Role, MockService.testConnection)
    rolesService = new RolesService(roleRepository)
    usersService = new UsersService(userRepository, rolesService)

    await roleRepository.save(MockService.mockRole)
    await userRepository.save(MockService.mockUser)

    return connection
  })

  afterEach(async () => {
    await userRepository.clear()
    await getConnection(MockService.testConnection).close()
  })

  it('should return a user', async () => {

    const userRepositoryFindOneSpy = jest.spyOn(userRepository, 'findOne')

    expect(await usersService.getByLogin(MockService.mockUser.login)).toEqual(MockService.mockUser)
    expect(userRepositoryFindOneSpy).toBeCalledWith({ relations: ['roles'], where: { login: MockService.mockUser.login }})
  })

  it('should return an array with users without roles', async () => {
    const userRepositoryFindSpy = jest.spyOn(userRepository, 'find')

    expect(await usersService.getAll()).toEqual(MockService.mockGetAllUsersDto)
    expect(userRepositoryFindSpy).toBeCalled()
  })

  it('throws an error if a user with specified login already exists', async () => {
    try {
      await usersService.create(MockService.mockUser)
    } catch (e) {
      expect(e).toBeInstanceOf(HttpException)
      expect(e.response).toBe('Такой пользователь уже существует')
    }
  })

  it('create a new user without passing role', async () => {
    const usersServiceGetByLoginSpy = jest.spyOn(usersService, 'getByLogin').mockResolvedValue(null)
    const rolesServiceCheckOrCreateSpy = jest.spyOn(rolesService, 'checkOrCreate').mockResolvedValue(MockService.mockRole)
    const userRepositorySaveSpy = jest.spyOn(userRepository, 'save').mockResolvedValue(null)

    await usersService.create(MockService.mockUserWithoutRole)

    expect(usersServiceGetByLoginSpy).toBeCalledWith(MockService.mockUserWithoutRole.login)
    expect(rolesServiceCheckOrCreateSpy).toBeCalledWith('Пользователь')
    expect(userRepositorySaveSpy).toBeCalledWith(MockService.mockUserWithoutRole)
  })

  it('create a new user with passing role', async () => {
    const usersServiceGetByLoginSpy = jest.spyOn(usersService, 'getByLogin').mockResolvedValue(null)
    const rolesServiceCreateRolesFromStringSpy = jest.spyOn(rolesService, 'createRolesFromString').mockResolvedValue([MockService.mockRole])
    const userRepositorySaveSpy = jest.spyOn(userRepository, 'save').mockResolvedValue(null)

    await usersService.create(MockService.mockUserWithRoles)

    expect(usersServiceGetByLoginSpy).toBeCalledWith(MockService.mockUserWithRoles.login)
    expect(rolesServiceCreateRolesFromStringSpy).toBeCalledWith(['Администратор'])
    expect(userRepositorySaveSpy).toBeCalledWith(MockService.mockUserWithRoles)
  })

  it('delete user', async () => {
    const usersServiceGetByLoginSpy = jest.spyOn(usersService, 'getByLogin').mockResolvedValue(MockService.mockUser)
    const userRepositoryRemoveSpy = jest.spyOn(userRepository, 'remove').mockResolvedValue(null)

    await usersService.delete(MockService.mockUser.login)

    expect(usersServiceGetByLoginSpy).toBeCalledWith('Login')
    expect(userRepositoryRemoveSpy).toBeCalledWith(MockService.mockUser)
  })

  // it('update user without passing role', async () => {
  //   const userRepositorySaveSpy = jest.spyOn(userRepository, 'save').mockResolvedValue(null)
  //
  //   await usersService.update(MockService.mockUser)
  //
  //   expect(userRepositorySaveSpy).toBeCalledWith(MockService.mockUser)
  // })

  it('update user with passing role', async () => {
    const usersServiceGetByLoginSpy = jest.spyOn(usersService, 'getByLogin').mockResolvedValue(MockService.mockUser)
    const rolesServiceCreateRolesFromStringSpy = jest.spyOn(rolesService, 'createRolesFromString').mockResolvedValue([MockService.mockRole])
    const userRepositorySaveSpy = jest.spyOn(userRepository, 'save').mockResolvedValue(null)

    await usersService.update(MockService.mockUserWithRoles)

    expect(usersServiceGetByLoginSpy).toBeCalledWith(MockService.mockUserWithRoles.login)
    expect(rolesServiceCreateRolesFromStringSpy).toBeCalledWith(MockService.mockUserWithRoles.roles)
    expect(userRepositorySaveSpy).toBeCalledWith(MockService.mockUser)
  })
})

