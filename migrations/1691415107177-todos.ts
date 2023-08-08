import { MigrationInterface, QueryRunner } from 'typeorm';

export class Todos1691415107177 implements MigrationInterface {
  name = 'create-todos-table-1691415107177';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "todos" (
                "id" SERIAL NOT NULL,
                "title" character varying NOT NULL,
                "description" character varying,
                "order_id" integer,
                "status" character varying NOT NULL DEFAULT 'test',
                "estimate" integer,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "soft_delete" boolean NOT NULL DEFAULT false,
                CONSTRAINT "PK_ca8cafd59ca6faaf67995344225" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "todos"
        `);
  }
}
