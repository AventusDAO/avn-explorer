module.exports = class Data1690908757104 {
    name = 'Data1690908757104'

    async up(db) {
        await db.query(`DROP INDEX "public"."IDX_39b1100285dba9714cf579b737"`)
        await db.query(`ALTER TABLE "nft" DROP COLUMN "nft_id"`)
        await db.query(`ALTER TABLE "nft" ADD "mint_block" integer NOT NULL`)
        await db.query(`ALTER TABLE "nft" ADD "mint_date" TIMESTAMP WITH TIME ZONE NOT NULL`)
        await db.query(`ALTER TABLE "nft" ADD "t1_authority" text`)
        await db.query(`ALTER TABLE "nft" ADD "royalties" jsonb`)
        await db.query(`ALTER TABLE "nft" ADD "unique_external_ref" text`)
    }

    async down(db) {
        await db.query(`CREATE INDEX "IDX_39b1100285dba9714cf579b737" ON "nft" ("nft_id") `)
        await db.query(`ALTER TABLE "nft" ADD "nft_id" numeric NOT NULL`)
        await db.query(`ALTER TABLE "nft" DROP COLUMN "mint_block"`)
        await db.query(`ALTER TABLE "nft" DROP COLUMN "mint_date"`)
        await db.query(`ALTER TABLE "nft" DROP COLUMN "t1_authority"`)
        await db.query(`ALTER TABLE "nft" DROP COLUMN "royalties"`)
        await db.query(`ALTER TABLE "nft" DROP COLUMN "unique_external_ref"`)
    }
}
