module.exports = class Data1669734391649 {
  name = 'Data1669734391649'

  async up(db) {
    await db.query(`CREATE TABLE "account" ("id" character varying NOT NULL, "updated_at" integer, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`)
    await db.query(`CREATE TABLE "token_balance_for_account" ("id" character varying NOT NULL, "amount" numeric NOT NULL, "token_id" character varying, "account_id" character varying, CONSTRAINT "PK_a06f76f3526118162f867b55e0c" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_8a0067ffbdbc34f82a755c8bb0" ON "token_balance_for_account" ("token_id") `)
    await db.query(`CREATE INDEX "IDX_a9d3d4ec441304f07c9e1f8e85" ON "token_balance_for_account" ("account_id") `)
    await db.query(`CREATE TABLE "chain_state" ("id" character varying NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "block_number" integer NOT NULL, CONSTRAINT "PK_e28e46a238ada7cbbcf711b3f6c" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_b15977afb801d90143ea51cdec" ON "chain_state" ("timestamp") `)
    await db.query(`CREATE INDEX "IDX_5596acea2cba293bbdc32b577c" ON "chain_state" ("block_number") `)
    await db.query(`ALTER TABLE "token_balance_for_account" ADD CONSTRAINT "FK_8a0067ffbdbc34f82a755c8bb0d" FOREIGN KEY ("token_id") REFERENCES "token"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    await db.query(`ALTER TABLE "token_balance_for_account" ADD CONSTRAINT "FK_a9d3d4ec441304f07c9e1f8e851" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
  }

  async down(db) {
    await db.query(`DROP TABLE "account"`)
    await db.query(`DROP TABLE "token_balance_for_account"`)
    await db.query(`DROP INDEX "public"."IDX_8a0067ffbdbc34f82a755c8bb0"`)
    await db.query(`DROP INDEX "public"."IDX_a9d3d4ec441304f07c9e1f8e85"`)
    await db.query(`DROP TABLE "chain_state"`)
    await db.query(`DROP INDEX "public"."IDX_b15977afb801d90143ea51cdec"`)
    await db.query(`DROP INDEX "public"."IDX_5596acea2cba293bbdc32b577c"`)
    await db.query(`ALTER TABLE "token_balance_for_account" DROP CONSTRAINT "FK_8a0067ffbdbc34f82a755c8bb0d"`)
    await db.query(`ALTER TABLE "token_balance_for_account" DROP CONSTRAINT "FK_a9d3d4ec441304f07c9e1f8e851"`)
  }
}
