import {
  BadRequestException, ConflictException, Injectable,
  InternalServerErrorException, NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { User } from './entities/user.entity.js';
import { Role } from '../roles/entities/role.entity.js';
import { RegisterDto } from '../auth/dto/auth.dto.js';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly usersRepo: Repository<User>,
    @InjectRepository(Role) private readonly rolesRepo: Repository<Role>,
  ) {}

  async create(dto: RegisterDto, passwordHash: string): Promise<User> {
    if (await this.usersRepo.existsBy({ email: dto.email })) {
      throw new ConflictException('Email ya registrado');
    }
    const user = this.usersRepo.create({
      email: dto.email, password: passwordHash, name: dto.name, phone: dto.phone ?? null,
    });
    return this.usersRepo.save(user);
  }

  findByEmail(email: string): Promise<User | null> {
    return this.usersRepo.findOneBy({ email });
  }


  async findAll() {
    try {
      const users = await this.usersRepo.find({ relations: { roles: true }, order: { created_at: 'ASC' } });
      return users.map((u) => ({
        id: u.id, email: u.email, name: u.name, roles: u.roles.map((r) => r.role_name),
      }));
    } catch {
      throw new InternalServerErrorException('Error al listar usuarios');
    }
  }

}