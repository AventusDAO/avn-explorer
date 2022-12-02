module.exports = class Data1669981045280 {
    name = 'Data1669981045280'

    async up(db) {
        await db.query(`CREATE TABLE "account" ("id" character varying NOT NULL, "updated_at" integer, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "current_chain_state" ("id" character varying NOT NULL, "token_balance" numeric(80,0) NOT NULL, "token_holders" integer NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "block_number" integer NOT NULL, CONSTRAINT "PK_635aee56410df525938bf40f669" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_b610f50e22008c895b1c9912bd" ON "current_chain_state" ("timestamp") `)
        await db.query(`CREATE INDEX "IDX_a9c38ffcf2e78137f75e24f88c" ON "current_chain_state" ("block_number") `)
        await db.query(`CREATE TABLE "chain_state" ("id" character varying NOT NULL, "token_balance" numeric(80,0) NOT NULL, "token_holders" integer NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "block_number" integer NOT NULL, CONSTRAINT "PK_e28e46a238ada7cbbcf711b3f6c" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_b15977afb801d90143ea51cdec" ON "chain_state" ("timestamp") `)
        await db.query(`CREATE INDEX "IDX_5596acea2cba293bbdc32b577c" ON "chain_state" ("block_number") `)
        await db.query(`CREATE TABLE "balance" ("id" character varying NOT NULL, "free" numeric(80,0) NOT NULL, "reserved" numeric(80,0) NOT NULL, "total" numeric(80,0) NOT NULL, "updated_at" integer NOT NULL, "account_id" text NOT NULL, CONSTRAINT "PK_079dddd31a81672e8143a649ca0" PRIMARY KEY ("id"))`)
    }

    async down(db) {
        await db.query(`DROP TABLE "account"`)
        await db.query(`DROP TABLE "current_chain_state"`)
        await db.query(`DROP INDEX "public"."IDX_b610f50e22008c895b1c9912bd"`)
        await db.query(`DROP INDEX "public"."IDX_a9c38ffcf2e78137f75e24f88c"`)
        await db.query(`DROP TABLE "chain_state"`)
        await db.query(`DROP INDEX "public"."IDX_b15977afb801d90143ea51cdec"`)
        await db.query(`DROP INDEX "public"."IDX_5596acea2cba293bbdc32b577c"`)
        await db.query(`DROP TABLE "balance"`)
    }
}
