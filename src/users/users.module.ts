import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from './users.model'
import { RolesModule } from '../roles/roles.module'
import { Role } from '../roles/roles.model'

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    TypeOrmModule.forFeature([User, Role]),
    RolesModule
  ]
})
export class UsersModule {}
