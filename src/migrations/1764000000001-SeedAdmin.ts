import { PasswordHasher } from '@nestjs/authentication';
import { MigrationInterface, QueryRunner } from 'typeorm';

export class SeedAdmin1764000000001 implements MigrationInterface {
  name = 'SeedAdmin1764000000001';

  async up(queryRunner: QueryRunner): Promise<void> {
    const email = process.env.ADMIN_EMAIL!;
    const hash = await new PasswordHasher().hash(process.env.ADMIN_PASSWORD!); // scrypt, como en el login

    await queryRunner.query(`
      INSERT INTO roles (role_name, description) VALUES
        ('admin', 'Administrador del sistema'),
        ('supervisor', 'Supervisor')
    `);
    await queryRunner.query(
      `INSERT INTO users (email, password, name) VALUES ($1, $2, 'Administrador')`,
      [email, hash],
    );
    await queryRunner.query(
      `INSERT INTO user_roles (user_id, role_id)
       SELECT u.id, r.id FROM users u, roles r
       WHERE u.email = $1 AND r.role_name = 'admin'`,
      [email],
    );
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE FROM users WHERE email = $1`, [process.env.ADMIN_EMAIL]);
    await queryRunner.query(`DELETE FROM roles WHERE role_name IN ('admin', 'supervisor')`);
  }
}