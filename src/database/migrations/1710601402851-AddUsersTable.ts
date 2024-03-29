import { MigrationInterface, QueryRunner, Table } from 'typeorm';
import * as bcrypt from 'bcrypt';

export class AddUsersTable1710601402851 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'users',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
          },
          {
            name: 'username',
            type: 'varchar',
            isUnique: true,
          },
          {
            name: 'password',
            type: 'varchar',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'edited_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'role',
            type: 'varchar',
            default: "'REGULAR'",
          },
        ],
      }),
    );

    const password = await bcrypt.hash('admin1234', 10);

    await queryRunner.query(`
            INSERT INTO users (id, username, password)
            VALUES (1, 'admin', '${password}')
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('users', true);
  }
}
