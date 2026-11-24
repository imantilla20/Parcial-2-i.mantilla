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

  /** Usuario con sus roles, o null (= 401). */
  findActiveWithRoles(id: string): Promise<User | null> {
    return this.usersRepo.findOne({ where: { id, is_active: true }, relations: { roles: true } });
  }

  async getProfile(id: string) {
    const user = await this.usersRepo.findOne({ where: { id }, relations: { roles: true } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return {                                   // NUNCA sale password
      id: user.id, email: user.email, name: user.name, phone: user.phone,
      roles: user.roles.map((r) => r.role_name),
    };
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

  async assignRoles(id: string, roleNames: string[]) {
    const user = await this.usersRepo.findOne({ where: { id }, relations: { roles: true } });
    if (!user) throw new NotFoundException('Usuario no encontrado');

    const uniqueNames = [...new Set(roleNames)];
    const roles = await this.rolesRepo.findBy({ role_name: In(uniqueNames) });
    if (roles.length !== uniqueNames.length) {         
      throw new BadRequestException('roles inválidos');
    }

    user.roles = roles;            // reemplaza los roles del usuario por los enviados
    await this.usersRepo.save(user);
    return { message: 'Roles asignados' };
  }
}