import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { User } from './users.model'
import { Repository } from 'typeorm'
import { GetAllUsersDto } from './dto/getAllUsers.dto'
import { RolesService } from '../roles/roles.service'

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private rolesService: RolesService,
  ) {}

  async getAll(): Promise<GetAllUsersDto[]> {
    const users = await this.userRepository.find()
    return users.map(user => new GetAllUsersDto(user))
  }

  getByLogin(login: string): Promise<User> {
    return this.userRepository.findOne({ relations: ['roles'], where: { login } })
  }

  async create(user): Promise<void> {
    const candidate = await this.getByLogin(user.login)
    if (candidate){
      throw new HttpException('Такой пользователь уже существует', HttpStatus.BAD_REQUEST)
    }
    if (!user.roles) {
      let role = await this.rolesService.checkOrCreate('Пользователь')
      user.roles = [role]
    } else {
      user.roles = await this.rolesService.createRolesFromString(user.roles)
    }
    await this.userRepository.save(user)
  }

  async delete(login: string): Promise<void> {
    const user = await this.getByLogin(login)
    await this.userRepository.remove(user)
  }

  async update(user) {
    if (!user.roles) {
      await this.userRepository.save(user)
    } else {
     let userForUpdate = await this.getByLogin(user.login)
     userForUpdate.roles = await this.rolesService.createRolesFromString(user.roles)

     userForUpdate.name = user.name
     userForUpdate.password = user.password

     await this.userRepository.save(userForUpdate)
    }
  }
}