module.exports = class Data1721923868176 {
    name = 'Data1721923868176'

    async up(db) {
        await db.query(`ALTER TABLE "cross_chain_transaction_event" ADD "rejection_reason" text`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "cross_chain_transaction_event" DROP COLUMN "rejection_reason"`)
    }
}
