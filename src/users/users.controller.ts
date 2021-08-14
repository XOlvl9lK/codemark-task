import { Body, Controller, Get, Param, Post, Put, UsePipes } from '@nestjs/common'
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/createUser.dto'
import { ValidationPipe } from '../pipe/validation.pipe'

interface Success {
  success: boolean
}

@Controller('users')
export class UsersController {

  constructor(private usersService: UsersService) {}

  @Get()
  async getAll() {
    return await this.usersService.getAll()
  }

  @Get('/:login')
  async getByLogin(@Param('login') login: string) {
    return await this.usersService.getByLogin(login)
  }

  @UsePipes(ValidationPipe)
  @Post('create')
  async create(@Body() user: CreateUserDto) {
    await this.usersService.create(user)
    return { success: true }
  }

  @Post('delete/:login')
  async delete(@Param('login') login: string) {
    await this.usersService.delete(login)
    return { success: true }
  }

  @UsePipes(ValidationPipe)
  @Put('update')
  async update(@Body() user: CreateUserDto) {
    await this.usersService.update(user)
    return { success: true }
  }

  success(): Success {
    return { success: true }
  }
}
