module.exports = class Data1673015353190 {
    name = 'Data1673015353190'

    async up(db) {
        await db.query(`CREATE TABLE "chain_state" ("id" character varying NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "block_number" integer NOT NULL, CONSTRAINT "PK_e28e46a238ada7cbbcf711b3f6c" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_b15977afb801d90143ea51cdec" ON "chain_state" ("timestamp") `)
        await db.query(`CREATE INDEX "IDX_5596acea2cba293bbdc32b577c" ON "chain_state" ("block_number") `)
        await db.query(`CREATE TABLE "account" ("id" character varying NOT NULL, "fees_total" numeric(80,0) NOT NULL, "updated_at" integer, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`)
    }

    async down(db) {
        await db.query(`DROP TABLE "chain_state"`)
        await db.query(`DROP INDEX "public"."IDX_b15977afb801d90143ea51cdec"`)
        await db.query(`DROP INDEX "public"."IDX_5596acea2cba293bbdc32b577c"`)
        await db.query(`DROP TABLE "account"`)
    }
}
