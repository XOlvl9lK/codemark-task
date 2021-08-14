import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Role } from './roles.model'

@Injectable()
export class RolesService {

  constructor(
    @InjectRepository(Role)
    private roleRepository: Repository<Role>
  ) {}

  getAll(): Promise<Role[]> {
    return this.roleRepository.find({ relations: ['users'] })
  }

  getByName(name: string): Promise<Role> {
    return this.roleRepository.findOne({ name })
  }

  async create(name: string): Promise<void> {
    await this.roleRepository.save({ name })
  }

  async createAndReturn(name: string): Promise<Role> {
    await this.create(name)
    return await this.getByName(name)
  }

  async checkOrCreate(name: string): Promise<Role> {
    let candidate = await this.getByName(name)
    if (!candidate) {
      candidate = await this.createAndReturn(name)
    }
    return candidate
  }

  async createRolesFromString(roles: string[]): Promise<Role[]> {
    let newRoles: Role[] = []
    for (const role of roles) {
      let newRole = await this.checkOrCreate(role)
      newRoles.push(newRole)
    }
    return newRoles
  }
}
