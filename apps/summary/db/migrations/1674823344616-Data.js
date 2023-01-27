module.exports = class Data1674823344616 {
    name = 'Data1674823344616'

    async up(db) {
        await db.query(`CREATE TABLE "summary_root" ("id" character varying NOT NULL, "root_hash" text NOT NULL, "from_block" integer NOT NULL, "to_block" integer NOT NULL, "is_validated" boolean NOT NULL, CONSTRAINT "PK_ac41216a2a7fae73602f508ad1d" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "chain_state" ("id" character varying NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "block_number" integer NOT NULL, CONSTRAINT "PK_e28e46a238ada7cbbcf711b3f6c" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_b15977afb801d90143ea51cdec" ON "chain_state" ("timestamp") `)
        await db.query(`CREATE INDEX "IDX_5596acea2cba293bbdc32b577c" ON "chain_state" ("block_number") `)
    }

    async down(db) {
        await db.query(`DROP TABLE "summary_root"`)
        await db.query(`DROP TABLE "chain_state"`)
        await db.query(`DROP INDEX "public"."IDX_b15977afb801d90143ea51cdec"`)
        await db.query(`DROP INDEX "public"."IDX_5596acea2cba293bbdc32b577c"`)
    }
}
