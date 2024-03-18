/* import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class AddMoviesTable1710711636517 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "movies",
                columns: [
                    {
                        name: "id",
                        type: "int",
                        isPrimary: true
                    },
                    {
                        name: "created",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "director",
                        type: "varchar",
                    },
                    {
                        name: "edited",
                        type: "timestamp",
                        default: "now()",
                    },
                    {
                        name: "episode_id",
                        type: "int",
                    },
                    {
                        name: "opening_crawl",
                        type: "varchar",
                    },
                    {
                        name: "planets",
                        type: "timestamp",
                        isArray: true,
                        isNullable: true,
                    },
                    {
                        name: "producer",
                        type: "varchar",
                    },
                    {
                        name: "release_date",
                        type: "varchar",
                    },
                    {
                        name: "species",
                        type: "timestamp",
                        isArray: true,
                        isNullable: true,
                    },
                    {
                        name: "starships",
                        type: "timestamp",
                        isArray: true,
                        isNullable: true,
                    },
                    {
                        name: "title",
                        type: "varchar",
                    },
                    {
                        name: "url",
                        type: "varchar",
                    },
                    {
                        name: "vehicles",
                        type: "timestamp",
                        isArray: true,
                        isNullable: true,
                    },
                ],
            })
        )
    }


    public async down(queryRunner: QueryRunner): Promise<void> {
        queryRunner.dropTable('movies', true)
    }
}
 */