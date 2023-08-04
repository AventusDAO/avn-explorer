module.exports = class Data1691151084272 {
    name = 'Data1691151084272'

    async up(db) {
        await db.query(`ALTER TABLE "token_balance_for_account" RENAME COLUMN "amount" TO "transfer_amount"`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "token_balance_for_account" RENAME COLUMN "transfer_amount" TO "amount"`)
    }
}
