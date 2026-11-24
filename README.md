# Preparcial 2 — Sistema de usuarios y roles (ISIS3710)

API REST con NestJS para manejar usuarios y roles:

- **Autenticación** con `@nestjs/authentication`: JWT (access token de 2 minutos) y refresh tokens con rotación.
- **Autorización** con policies de `@nestjs/authorization` (`@Can`, `@Can.Anyone`, `@Public`). El admin pasa todas las reglas con `before()`.
- **PostgreSQL** con TypeORM y relación muchos a muchos entre `users` y `roles`.
- **Migraciones SQL**: crean las tablas, los roles `admin` y `supervisor`, y el usuario admin.
- Contraseñas guardadas con `PasswordHasher` (scrypt); nunca se devuelven en las respuestas.

## Requisitos

- Node.js 20 o superior
- Docker Desktop (solo para la base de datos)

## Cómo correrlo

1. Copiar `.env.default` como `.env` y cambiar `JWT_SECRET` por un valor aleatorio:
   ```bash
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
2. Levantar la base de datos:
   ```bash
   docker compose up -d
   ```
3. Instalar dependencias:
   ```bash
   npm install --legacy-peer-deps
   ```
4. Arrancar la API (al iniciar corre las migraciones):
   ```bash
   npm run start:dev
   ```

La API queda en `http://localhost:3000`.

## Variables de entorno

| Variable | Para qué sirve |
|---|---|
| `DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASS`, `DB_NAME` | Conexión a PostgreSQL (Docker usa las mismas) |
| `JWT_SECRET` | Clave para firmar los tokens (mínimo 32 caracteres aleatorios) |
| `JWT_EXPIRES_IN` | Duración del access token (`2m`) |
| `JWT_REFRESH_EXPIRES_IN` | Duración del refresh token (`7d`) |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Usuario admin que crea la migración |

## Usuario admin

Lo crea la migración `SeedAdmin` con los valores de `ADMIN_EMAIL` y `ADMIN_PASSWORD`. Con `.env.default`: `admin@test.com` / `Admin12345`.

## Endpoints

| Método | URI | Acceso | Éxito |
|---|---|---|---|
| POST | `/auth/register` | público | 201 |
| POST | `/auth/login` | público | 200 |
| POST | `/auth/refresh` | público | 200 |
| POST | `/auth/logout` | público | 204 |
| POST | `/roles` | admin | 201 |
| GET | `/roles` | admin | 200 |
| PATCH | `/users/:id/roles` | admin | 200 |
| GET | `/users/me` | autenticado | 200 |
| GET | `/users` | admin | 200 |

Las rutas protegidas usan el header `Authorization: Bearer <accessToken>`. Sin token responden 401; con token pero sin el rol requerido, 403.

## Script de usuarios y roles probados

`db/pruebas.sql` inserta usuarios de prueba (solo con los roles `admin` y `supervisor`) y luego verifica roles, usuarios y contraseñas. Con la API arrancada al menos una vez:

```bash
docker cp db/pruebas.sql parcial_2_db:/tmp/pruebas.sql
docker exec parcial_2_db psql -U parcial2 -d parcial_2_db -f /tmp/pruebas.sql
```

Usuarios de prueba (contraseña `Clave12345`):

| Email | Roles | Qué prueba |
|---|---|---|
| `laura.gomez@test.com` | admin | acceso total |
| `carlos.perez@test.com` | supervisor | 403 en rutas de admin |
| `andrea.ruiz@test.com` | admin, supervisor | usuario con dos roles |
| `juan.martinez@test.com` | (ninguno) | como queda al registrarse |
| `sofia.lopez@test.com` | supervisor, desactivada | login → 423 |
