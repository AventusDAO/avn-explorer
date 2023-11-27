module.exports = class Data1691151084272 {
    name = 'Data1691151084272'

    async up(db) {
        await db.query(`ALTER TABLE "token_balance_for_account" RENAME COLUMN "amount" TO "transfer_amount"`)

        await db.query(`GRANT USAGE ON SCHEMA public To readonly`)
        await db.query(`GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly`)
        await db.query(`GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO readonly`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "token_balance_for_account" RENAME COLUMN "transfer_amount" TO "amount"`)
    }
}
