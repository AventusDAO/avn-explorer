module.exports = class Data1702636291831 {
    name = 'Data1702636291831'

    async up(db) {
        await db.query(`ALTER TABLE "token_transfer" ADD "schedule_name" text`)
        await db.query(`ALTER TABLE "token_transfer" ADD "sender_nonce" numeric`)
        await db.query(`ALTER TABLE "token_transfer" ADD "t1_recipient" text`)
        await db.query(`ALTER TABLE "token_transfer" ADD "lower_id" integer`)


        await db.query(`GRANT USAGE ON SCHEMA public To readonly`) 
         await db.query(`GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly`) 
         await db.query(`GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO readonly`) 
  
         await db.query(`GRANT USAGE ON SCHEMA public To explorer_ro`) 
         await db.query(`GRANT SELECT ON ALL TABLES IN SCHEMA public TO explorer_ro`) 
         await db.query(`GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO explorer_ro`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "token_transfer" DROP COLUMN "schedule_name"`)
        await db.query(`ALTER TABLE "token_transfer" DROP COLUMN "sender_nonce"`)
        await db.query(`ALTER TABLE "token_transfer" DROP COLUMN "t1_recipient"`)
        await db.query(`ALTER TABLE "token_transfer" DROP COLUMN "lower_id"`)
    }
}
