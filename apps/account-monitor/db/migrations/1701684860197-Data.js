module.exports = class Data1701684860197 {
    name = 'Data1701684860197'

    async up(db) {
        await db.query(`ALTER TABLE "token_transfer" ADD "payer_id" character varying`)
        await db.query(`CREATE INDEX "IDX_f969fe3a497c6ee19a18211544" ON "token_transfer" ("payer_id") `)
        await db.query(`ALTER TABLE "token_transfer" ADD CONSTRAINT "FK_f969fe3a497c6ee19a182115442" FOREIGN KEY ("payer_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)


        // await db.query(`GRANT USAGE ON SCHEMA public To readonly`)
        // await db.query(`GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly`)
        // await db.query(`GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO readonly`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "token_transfer" DROP COLUMN "payer_id"`)
        await db.query(`DROP INDEX "public"."IDX_f969fe3a497c6ee19a18211544"`)
        await db.query(`ALTER TABLE "token_transfer" DROP CONSTRAINT "FK_f969fe3a497c6ee19a182115442"`)
    }
}
