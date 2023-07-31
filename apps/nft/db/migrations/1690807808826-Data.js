module.exports = class Data1690807808826 {
    name = 'Data1690807808826'

    async up(db) {
        await db.query(`CREATE TABLE "nft" ("id" character varying NOT NULL, "nft_id" numeric NOT NULL, "owner" text NOT NULL, CONSTRAINT "PK_8f46897c58e23b0e7bf6c8e56b0" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_39b1100285dba9714cf579b737" ON "nft" ("nft_id") `)
        await db.query(`CREATE INDEX "IDX_78260787a2eb44fb414dd6b961" ON "nft" ("owner") `)
    }

    async down(db) {
        await db.query(`DROP TABLE "nft"`)
        await db.query(`DROP INDEX "public"."IDX_39b1100285dba9714cf579b737"`)
        await db.query(`DROP INDEX "public"."IDX_78260787a2eb44fb414dd6b961"`)
    }
}
