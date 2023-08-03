module.exports = class Data1691073451004 {
    name = 'Data1691073451004'

    async up(db) {
        await db.query(`ALTER TABLE "token_balance_for_account" ADD "balance" numeric(80,0) NOT NULL`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "token_balance_for_account" DROP COLUMN "balance"`)
    }
}
