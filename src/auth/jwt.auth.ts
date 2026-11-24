import { Injectable } from '@nestjs/common';
import { AuthenticationRegistry, JwtBearerProvider, type JwtClaims } from '@nestjs/authentication';
import { User } from '../users/entities/user.entity.js';
import { UsersService } from '../users/users.service.js';

@Injectable()
export class JwtAuth extends JwtBearerProvider<User> {
  constructor(
    private readonly usersService: UsersService,
    registry: AuthenticationRegistry,
  ) {
    super();                          
    registry.registerProvider(this);  
  }

  // Del token sale `sub` y se cargael usuario CON roles. 
  validate({ sub }: JwtClaims) {
    return sub ? this.usersService.findActiveWithRoles(sub) : null;
  }
}