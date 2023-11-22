module.exports = class Data1691508023725 {
    name = 'Data1691508023725'

    async up(db) {
        await db.query(`ALTER TABLE "nft_transfer" ADD "nonce" numeric`)
        await db.query(`ALTER TABLE "nft_transfer" ADD "relayer_id" character varying`)
        await db.query(`ALTER TABLE "token_transfer" ADD "nonce" numeric`)
        await db.query(`ALTER TABLE "token_transfer" ADD "relayer_id" character varying`)
        await db.query(`CREATE INDEX IF NOT EXISTS "IDX_f6e64c228ad00b8dbdf0afec05" ON "nft_transfer" ("relayer_id") `)
        await db.query(`CREATE INDEX IF NOT EXISTS "IDX_2329c9c1414a868706f9c2483b" ON "nft_transfer" ("nonce") `)
        await db.query(`CREATE INDEX IF NOT EXISTS "IDX_c53243bf2b970f2133e46c67bd" ON "token_transfer" ("relayer_id") `)
        await db.query(`CREATE INDEX IF NOT EXISTS "IDX_8d8e30d2fbac29e746147f25b4" ON "token_transfer" ("nonce") `)
        await db.query(`ALTER TABLE "nft_transfer" ADD CONSTRAINT "FK_f6e64c228ad00b8dbdf0afec053" FOREIGN KEY ("relayer_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "token_transfer" ADD CONSTRAINT "FK_c53243bf2b970f2133e46c67bde" FOREIGN KEY ("relayer_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`GRANT USAGE ON SCHEMA public To readonly`)
        await db.query(`GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly`)
        await db.query(`GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO readonly`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "nft_transfer" DROP COLUMN "nonce"`)
        await db.query(`ALTER TABLE "nft_transfer" DROP COLUMN "relayer_id"`)
        await db.query(`ALTER TABLE "token_transfer" DROP COLUMN "nonce"`)
        await db.query(`ALTER TABLE "token_transfer" DROP COLUMN "relayer_id"`)
        await db.query(`DROP INDEX "public"."IDX_f6e64c228ad00b8dbdf0afec05"`)
        await db.query(`DROP INDEX "public"."IDX_2329c9c1414a868706f9c2483b"`)
        await db.query(`DROP INDEX "public"."IDX_c53243bf2b970f2133e46c67bd"`)
        await db.query(`DROP INDEX "public"."IDX_8d8e30d2fbac29e746147f25b4"`)
        await db.query(`ALTER TABLE "nft_transfer" DROP CONSTRAINT "FK_f6e64c228ad00b8dbdf0afec053"`)
        await db.query(`ALTER TABLE "token_transfer" DROP CONSTRAINT "FK_c53243bf2b970f2133e46c67bde"`)
    }
}
