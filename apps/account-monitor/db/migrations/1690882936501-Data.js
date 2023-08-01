module.exports = class Data1690882936501 {
    name = 'Data1690882936501'

    async up(db) {
        await db.query(`ALTER TABLE "account_token" DROP CONSTRAINT "PK_a55842d3341d42534e39f85e931"`)
        await db.query(`ALTER TABLE "account_token" DROP COLUMN "id"`)
        await db.query(`ALTER TABLE "account_token" ADD "id" character varying NOT NULL`)
        await db.query(`ALTER TABLE "account_token" ADD CONSTRAINT "PK_a55842d3341d42534e39f85e931" PRIMARY KEY ("id")`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "account_token" ADD CONSTRAINT "PK_a55842d3341d42534e39f85e931" PRIMARY KEY ("id")`)
        await db.query(`ALTER TABLE "account_token" ADD "id" SERIAL NOT NULL`)
        await db.query(`ALTER TABLE "account_token" DROP COLUMN "id"`)
        await db.query(`ALTER TABLE "account_token" DROP CONSTRAINT "PK_a55842d3341d42534e39f85e931"`)
    }
}
