import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { PasswordHasher, TokenService } from '@nestjs/authentication';
import { UsersService } from '../users/users.service.js';
import { LoginDto, RegisterDto } from './dto/auth.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly hasher: PasswordHasher,  
    private readonly tokens: TokenService,     
  ) {}

  async register(dto: RegisterDto) {
    const passwordHash = await this.hasher.hash(dto.password);
    const user = await this.usersService.create(dto, passwordHash);
    return { message: 'Usuario registrado con éxito', userId: user.id };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    const valid = await this.hasher.verify(dto.password, user?.password);
    if (!user || !valid) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }
    if (!user.is_active) {
      throw new HttpException('Usuario desactivado', HttpStatus.LOCKED); // 423
    }
    return this.tokens.issue(user.id, { method: 'password' }); // { accessToken, refreshToken, expiresIn }
  }

  refresh(refreshToken: string) {
    return this.tokens.refresh(refreshToken); // usado → 401 automático
  }

  async logout(refreshToken: string) {
    await this.tokens.revoke(refreshToken);
  }
}