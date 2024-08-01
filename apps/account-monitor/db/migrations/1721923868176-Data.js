module.exports = class Data1721923868176 {
    name = 'Data1721923868176'

    async up(db) {
        await db.query(`ALTER TABLE "cross_chain_transaction_event" ADD "rejection_reason" text`)
        await db.query(`GRANT USAGE ON SCHEMA public To readonly`) 
        await db.query(`GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly`) 
        await db.query(`GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO readonly`) 
 
        await db.query(`GRANT USAGE ON SCHEMA public To explorer_ro`) 
        await db.query(`GRANT SELECT ON ALL TABLES IN SCHEMA public TO explorer_ro`) 
        await db.query(`GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO explorer_ro`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "cross_chain_transaction_event" DROP COLUMN "rejection_reason"`)
    }
}
