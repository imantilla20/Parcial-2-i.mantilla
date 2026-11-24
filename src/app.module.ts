import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthenticationModule, type Duration } from '@nestjs/authentication';
import { AuthorizationModule } from '@nestjs/authorization';
import { UsersModule } from './users/users.module.js';
import { RolesModule } from './roles/roles.module.js';
import { AuthModule } from './auth/auth.module.js';
import { ParkingSpotsModule } from './parking_spots/parking_spots.module.js';
import { ReservationsModule } from './reservations/reservations.module.js';
import { InitSchema1764000000000 } from './migrations/1764000000000-InitSchema.js';
import { SeedAdmin1764000000001 } from './migrations/1764000000001-SeedAdmin.js';
import { CreateReservation1764000000002 } from './migrations/1764000000002-CreateReservation.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.getOrThrow<string>('DB_HOST'),
        port: Number(config.getOrThrow('DB_PORT')),
        username: config.getOrThrow<string>('DB_USER'),
        password: config.getOrThrow<string>('DB_PASS'),
        database: config.getOrThrow<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,                  // actualiza tablas 
        migrations: [InitSchema1764000000000, SeedAdmin1764000000001, CreateReservation1764000000002], // migraciones
        migrationsRun: true,                // corre las migraciones pendientes al arrancar (van ANTES que synchronize)
      }),
    }),
    AuthenticationModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        accessToken: {
          key: config.getOrThrow<string>('JWT_SECRET'),
          issuer: 'parcial-2-api',
          audience: 'parcial-2-clients',
          ttl: config.getOrThrow<Duration>('JWT_EXPIRES_IN'),        // '2m' → expiresIn: 120
        },
        refreshToken: { ttl: config.getOrThrow<Duration>('JWT_REFRESH_EXPIRES_IN') }, // '7d'
        allowInMemoryStorage: true,         // refresh tokens en memoria 
      }),
    }),
    AuthorizationModule.forRoot(),          
    UsersModule,
    RolesModule,
    AuthModule,
    ParkingSpotsModule,
    ReservationsModule,

  ],
})
export class AppModule {}