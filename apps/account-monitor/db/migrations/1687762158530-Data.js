module.exports = class Data1687762158530 {
    name = 'Data1687762158530'

    async up(db) {
        await db.query(`CREATE TABLE "transfer" ("id" character varying NOT NULL, "block_number" integer NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "extrinsic_hash" text, "from" text, "to" text, "amount" numeric NOT NULL, "token_name" text, "token_id" text NOT NULL, "pallet" text NOT NULL, "method" text NOT NULL, CONSTRAINT "PK_fd9ddbdd49a17afcbe014401295" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_d6624eacc30144ea97915fe846" ON "transfer" ("block_number") `)
        await db.query(`CREATE INDEX "IDX_70ff8b624c3118ac3a4862d22c" ON "transfer" ("timestamp") `)
        await db.query(`CREATE INDEX "IDX_070c555a86b0b41a534a55a659" ON "transfer" ("extrinsic_hash") `)
        await db.query(`CREATE INDEX "IDX_be54ea276e0f665ffc38630fc0" ON "transfer" ("from") `)
        await db.query(`CREATE INDEX "IDX_4cbc37e8c3b47ded161f44c24f" ON "transfer" ("to") `)
        await db.query(`CREATE INDEX "IDX_f4007436c1b546ede08a4fd7ab" ON "transfer" ("amount") `)
        await db.query(`CREATE INDEX "IDX_2e105a5e6acf1852eaa2a84984" ON "transfer" ("token_name") `)
        await db.query(`CREATE INDEX "IDX_b27b1150b8a7af68424540613c" ON "transfer" ("token_id") `)
        await db.query(`CREATE INDEX "IDX_4e352c4969cb070c70cf7e3deb" ON "transfer" ("pallet") `)
        await db.query(`CREATE INDEX "IDX_d2592e40ba2366307a0b3e6883" ON "transfer" ("method") `)
        await db.query(`CREATE TABLE "token_lookup" ("id" SERIAL NOT NULL, "token_id" text NOT NULL, "token_name" text NOT NULL, CONSTRAINT "PK_85cc52b0c9861e62d7d78df8d35" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_ed36cbc8debd00719e4a7ab3bb" ON "token_lookup" ("token_id") `)
        await db.query(`CREATE INDEX "IDX_bf8b69df15c998c17ac6c2ee3e" ON "token_lookup" ("token_name") `)
    }

    async down(db) {
        await db.query(`DROP TABLE "transfer"`)
        await db.query(`DROP INDEX "public"."IDX_d6624eacc30144ea97915fe846"`)
        await db.query(`DROP INDEX "public"."IDX_70ff8b624c3118ac3a4862d22c"`)
        await db.query(`DROP INDEX "public"."IDX_070c555a86b0b41a534a55a659"`)
        await db.query(`DROP INDEX "public"."IDX_be54ea276e0f665ffc38630fc0"`)
        await db.query(`DROP INDEX "public"."IDX_4cbc37e8c3b47ded161f44c24f"`)
        await db.query(`DROP INDEX "public"."IDX_f4007436c1b546ede08a4fd7ab"`)
        await db.query(`DROP INDEX "public"."IDX_2e105a5e6acf1852eaa2a84984"`)
        await db.query(`DROP INDEX "public"."IDX_b27b1150b8a7af68424540613c"`)
        await db.query(`DROP INDEX "public"."IDX_4e352c4969cb070c70cf7e3deb"`)
        await db.query(`DROP INDEX "public"."IDX_d2592e40ba2366307a0b3e6883"`)
        await db.query(`DROP TABLE "token_lookup"`)
        await db.query(`DROP INDEX "public"."IDX_ed36cbc8debd00719e4a7ab3bb"`)
        await db.query(`DROP INDEX "public"."IDX_bf8b69df15c998c17ac6c2ee3e"`)
    }
}