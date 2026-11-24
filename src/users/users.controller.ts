import { Body, Controller, Get, Param, ParseUUIDPipe, Patch } from '@nestjs/common';
import { CurrentUser } from '@nestjs/authentication';
import { Can } from '@nestjs/authorization';
import { UsersService } from './users.service.js';
import { UserPolicy } from './user.policy.js';
import { User } from './entities/user.entity.js';
import { AssignRolesDto } from './dto/assign-roles.dto.js';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  
  @Can.Anyone()                       
  @Get('me')
  me(@CurrentUser() user: User) {
    return this.usersService.getProfile(user.id);
  }

  @Can(UserPolicy, 'list')
  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Can(UserPolicy, 'assignRoles')
  @Patch(':id/roles')
  assignRoles(@Param('id', ParseUUIDPipe) id: string, @Body() dto: AssignRolesDto) {
    return this.usersService.assignRoles(id, dto.roles);
  }
}