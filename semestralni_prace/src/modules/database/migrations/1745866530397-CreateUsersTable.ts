import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateUsersTable1745866530397 implements MigrationInterface {

    name = 'CreateUsersTable1745866530397'

    async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'users',
            columns: [
                {
                    name: 'id',
                    type: 'bigint',
                    isPrimary: true
                },
                {
                    name: 'firstname',
                    type: 'varchar(255)',
                },
                {
                    name: 'lastname',
                    type: 'varchar(255)',
                },
                {
                    name: 'email',
                    type: 'varchar(255)',
                    isUnique: true,
                },
                {
                    name: 'password',
                    type: 'varchar(255)',
                },
            ]
        }))
    }

    async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('users')
    }

}
