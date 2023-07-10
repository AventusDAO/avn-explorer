module.exports = class Data1688990479100 {
    name = 'Data1688990479100'

    async up(db) {
        await db.query(`ALTER TABLE "token_balance_for_account" DROP CONSTRAINT "PK_a06f76f3526118162f867b55e0c"`)
        await db.query(`ALTER TABLE "token_balance_for_account" DROP COLUMN "id"`)
        await db.query(`ALTER TABLE "token_balance_for_account" ADD "id" SERIAL NOT NULL`)
        await db.query(`ALTER TABLE "token_balance_for_account" ADD CONSTRAINT "PK_a06f76f3526118162f867b55e0c" PRIMARY KEY ("id")`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "token_balance_for_account" ADD CONSTRAINT "PK_a06f76f3526118162f867b55e0c" PRIMARY KEY ("id")`)
        await db.query(`ALTER TABLE "token_balance_for_account" ADD "id" character varying NOT NULL`)
        await db.query(`ALTER TABLE "token_balance_for_account" DROP COLUMN "id"`)
        await db.query(`ALTER TABLE "token_balance_for_account" DROP CONSTRAINT "PK_a06f76f3526118162f867b55e0c"`)
    }
}
