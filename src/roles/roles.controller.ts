import { Body, Controller, Get, Post } from '@nestjs/common';
import { Can } from '@nestjs/authorization';
import { RolesService } from './roles.service.js';
import { RolePolicy } from './role.policy.js';
import { CreateRoleDto } from './dto/create-role.dto.js';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Can(RolePolicy, 'create')
  @Post()
  create(@Body() dto: CreateRoleDto) {
    return this.rolesService.create(dto);
  }

  @Can(RolePolicy, 'list')
  @Get()
  findAll() {
    return this.rolesService.findAll();
  }
}