module.exports = class Data1691495519042 {
    name = 'Data1691495519042'

    async up(db) {
        await db.query(`CREATE TABLE "batch" ("id" character varying NOT NULL, "owner" text NOT NULL, "mint_block" integer NOT NULL, "mint_date" TIMESTAMP WITH TIME ZONE NOT NULL, "unique_external_ref" text, "t1_authority" text, "royalties" jsonb, CONSTRAINT "PK_57da3b830b57bec1fd329dcaf43" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_3cef79d47089d395b29e880cec" ON "batch" ("owner") `)
        await db.query(`ALTER TABLE "nft" ADD "batch_id" text`)
        await db.query(`ALTER TABLE "nft" ADD "index" integer`)
    }

    async down(db) {
        await db.query(`DROP TABLE "batch"`)
        await db.query(`DROP INDEX "public"."IDX_3cef79d47089d395b29e880cec"`)
        await db.query(`ALTER TABLE "nft" DROP COLUMN "batch_id"`)
        await db.query(`ALTER TABLE "nft" DROP COLUMN "index"`)
    }
}
