import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity.js';
import { CreateRoleDto } from './dto/create-role.dto.js';

@Injectable()
export class RolesService {
  constructor(@InjectRepository(Role) private readonly rolesRepo: Repository<Role>) {}

  async create(dto: CreateRoleDto) {
    if (await this.rolesRepo.existsBy({ role_name: dto.role_name })) {
      throw new ConflictException('role_name ya existe');
    }
    const role = await this.rolesRepo.save(
      this.rolesRepo.create({ role_name: dto.role_name, description: dto.description ?? null }),
    );
    return { message: 'Rol creado con éxito', roleId: role.id };
  }

  async findAll() {
    try {
      return await this.rolesRepo.find({
        select: { id: true, role_name: true, description: true },
        order: { role_name: 'ASC' },
      });
    } catch {
      throw new InternalServerErrorException('Error al obtener roles');
    }
  }
}