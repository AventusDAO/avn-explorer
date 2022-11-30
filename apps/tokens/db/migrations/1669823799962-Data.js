module.exports = class Data1669823799962 {
  name = 'Data1669823799962'

  async up(db) {
    await db.query(`CREATE TABLE "chain_state" ("id" character varying NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "block_number" integer NOT NULL, CONSTRAINT "PK_e28e46a238ada7cbbcf711b3f6c" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_b15977afb801d90143ea51cdec" ON "chain_state" ("timestamp") `)
    await db.query(`CREATE INDEX "IDX_5596acea2cba293bbdc32b577c" ON "chain_state" ("block_number") `)
    await db.query(`CREATE TABLE "token_balance" ("id" character varying NOT NULL, "amount" numeric(80,0) NOT NULL, "token_id" text NOT NULL, CONSTRAINT "PK_dc23ea262a0188977523d90ae7f" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_5813c3040e74c285719679c693" ON "token_balance" ("token_id") `)
    await db.query(`CREATE TABLE "token_balance_for_account" ("id" character varying NOT NULL, "amount" numeric(80,0) NOT NULL, "token_id" text NOT NULL, "account_id" text NOT NULL, CONSTRAINT "PK_a06f76f3526118162f867b55e0c" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_8a0067ffbdbc34f82a755c8bb0" ON "token_balance_for_account" ("token_id") `)
    await db.query(`CREATE INDEX "IDX_a9d3d4ec441304f07c9e1f8e85" ON "token_balance_for_account" ("account_id") `)
  }

  async down(db) {
    await db.query(`DROP TABLE "chain_state"`)
    await db.query(`DROP INDEX "public"."IDX_b15977afb801d90143ea51cdec"`)
    await db.query(`DROP INDEX "public"."IDX_5596acea2cba293bbdc32b577c"`)
    await db.query(`DROP TABLE "token_balance"`)
    await db.query(`DROP INDEX "public"."IDX_5813c3040e74c285719679c693"`)
    await db.query(`DROP TABLE "token_balance_for_account"`)
    await db.query(`DROP INDEX "public"."IDX_8a0067ffbdbc34f82a755c8bb0"`)
    await db.query(`DROP INDEX "public"."IDX_a9d3d4ec441304f07c9e1f8e85"`)
  }
}
