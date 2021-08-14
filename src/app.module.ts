import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from './users/users.module';
import { ConfigModule } from '@nestjs/config'
import { User } from './users/users.model'
import { RolesModule } from './roles/roles.module';
import { Role } from './roles/roles.model'


@Module({
  controllers: [],
  providers: [],
  imports: [
    ConfigModule.forRoot({
      envFilePath: '.env'
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.HOST,
      port: Number(process.env.PG_PORT),
      username: process.env.PG_USERNAME,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
      entities: [User, Role],
      synchronize: true,
      autoLoadEntities: true
    }),
    UsersModule,
    RolesModule,
  ]
})
export class AppModule {

}