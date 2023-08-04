module.exports = class Data1691157860863 {
    name = 'Data1691157860863'

    async up(db) {
        await db.query(`ALTER TABLE "nft_transfer" ADD "payer_id" character varying`)
        await db.query(`ALTER TABLE "token_transfer" ADD "payer_id" character varying`)
        await db.query(`CREATE INDEX "IDX_e501ec9b6a36a8a6a1a231cf21" ON "nft_transfer" ("payer_id") `)
        await db.query(`CREATE INDEX "IDX_f969fe3a497c6ee19a18211544" ON "token_transfer" ("payer_id") `)
        await db.query(`ALTER TABLE "nft_transfer" ADD CONSTRAINT "FK_e501ec9b6a36a8a6a1a231cf212" FOREIGN KEY ("payer_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "token_transfer" ADD CONSTRAINT "FK_f969fe3a497c6ee19a182115442" FOREIGN KEY ("payer_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "nft_transfer" DROP COLUMN "payer_id"`)
        await db.query(`ALTER TABLE "token_transfer" DROP COLUMN "payer_id"`)
        await db.query(`DROP INDEX "public"."IDX_e501ec9b6a36a8a6a1a231cf21"`)
        await db.query(`DROP INDEX "public"."IDX_f969fe3a497c6ee19a18211544"`)
        await db.query(`ALTER TABLE "nft_transfer" DROP CONSTRAINT "FK_e501ec9b6a36a8a6a1a231cf212"`)
        await db.query(`ALTER TABLE "token_transfer" DROP CONSTRAINT "FK_f969fe3a497c6ee19a182115442"`)
    }
}
