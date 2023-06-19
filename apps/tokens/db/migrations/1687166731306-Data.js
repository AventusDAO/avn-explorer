module.exports = class Data1687166731306 {
    name = 'Data1687166731306'

    async up(db) {
        await db.query(`ALTER TABLE "token_balance_for_account" ADD "reason" text NOT NULL`)
        await db.query(`ALTER TABLE "token_balance_for_account" ADD "timestamp" TIMESTAMP WITH TIME ZONE`)
        await db.query(`CREATE INDEX "IDX_e736bdb7db55330b252ddc5b4e" ON "token_balance_for_account" ("reason") `)
        await db.query(`CREATE INDEX "IDX_8fd1e33c6dfd00175c046d2427" ON "token_balance_for_account" ("timestamp") `)
    }

    async down(db) {
        await db.query(`ALTER TABLE "token_balance_for_account" DROP COLUMN "reason"`)
        await db.query(`ALTER TABLE "token_balance_for_account" DROP COLUMN "timestamp"`)
        await db.query(`DROP INDEX "public"."IDX_e736bdb7db55330b252ddc5b4e"`)
        await db.query(`DROP INDEX "public"."IDX_8fd1e33c6dfd00175c046d2427"`)
    }
}
