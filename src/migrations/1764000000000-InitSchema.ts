import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitSchema1764000000000 implements MigrationInterface {
  name = 'InitSchema1764000000000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE users (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email       VARCHAR(150) NOT NULL UNIQUE,
        password    VARCHAR(255) NOT NULL,
        name        VARCHAR(100) NOT NULL,
        phone       VARCHAR(30),
        is_active   BOOLEAN NOT NULL DEFAULT TRUE,
        created_at  TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    await queryRunner.query(`
      CREATE TABLE roles (
        id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        role_name   VARCHAR(50) NOT NULL UNIQUE,
        description VARCHAR(255),
        created_at  TIMESTAMP NOT NULL DEFAULT NOW()
      )
    `);
    await queryRunner.query(`
      CREATE TABLE user_roles (
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
        PRIMARY KEY (user_id, role_id)
      )
    `);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE user_roles`);
    await queryRunner.query(`DROP TABLE roles`);
    await queryRunner.query(`DROP TABLE users`);
  }
}