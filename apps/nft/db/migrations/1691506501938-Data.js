module.exports = class Data1691506501938 {
    name = 'Data1691506501938'

    async up(db) {
        await db.query(`CREATE TABLE "nft" ("id" character varying NOT NULL, "owner" text NOT NULL, "mint_block" integer NOT NULL, "mint_date" TIMESTAMP WITH TIME ZONE NOT NULL, "unique_external_ref" text, "t1_authority" text, "royalties" jsonb, "batch_id" text, "index" integer, CONSTRAINT "PK_8f46897c58e23b0e7bf6c8e56b0" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_78260787a2eb44fb414dd6b961" ON "nft" ("owner") `)
        await db.query(`CREATE TABLE "batch_nft" ("id" character varying NOT NULL, "owner" text NOT NULL, "mint_block" integer NOT NULL, "mint_date" TIMESTAMP WITH TIME ZONE NOT NULL, "t1_authority" text NOT NULL, "royalties" jsonb, "total_supply" integer NOT NULL, CONSTRAINT "PK_f00bae6a2980c5af8018b1c625c" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_4670b6759e4e89097e751527dd" ON "batch_nft" ("owner") `)
    }

    async down(db) {
        await db.query(`DROP TABLE "nft"`)
        await db.query(`DROP INDEX "public"."IDX_78260787a2eb44fb414dd6b961"`)
        await db.query(`DROP TABLE "batch_nft"`)
        await db.query(`DROP INDEX "public"."IDX_4670b6759e4e89097e751527dd"`)
    }
}
