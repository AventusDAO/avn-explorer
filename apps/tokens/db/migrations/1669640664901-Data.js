module.exports = class Data1669640664901 {
  name = 'Data1669640664901'

  async up(db) {
    await db.query(`CREATE TABLE "token_balance" ("id" character varying NOT NULL, "amount" numeric(80,0) NOT NULL, "token_id" character varying, CONSTRAINT "PK_dc23ea262a0188977523d90ae7f" PRIMARY KEY ("id"))`)
    await db.query(`CREATE INDEX "IDX_5813c3040e74c285719679c693" ON "token_balance" ("token_id") `)
    await db.query(`CREATE TABLE "token" ("id" character varying NOT NULL, "name" text NOT NULL, CONSTRAINT "PK_82fae97f905930df5d62a702fc9" PRIMARY KEY ("id"))`)
    await db.query(`ALTER TABLE "token_balance" ADD CONSTRAINT "FK_5813c3040e74c285719679c6935" FOREIGN KEY ("token_id") REFERENCES "token"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
  }

  async down(db) {
    await db.query(`DROP TABLE "token_balance"`)
    await db.query(`DROP INDEX "public"."IDX_5813c3040e74c285719679c693"`)
    await db.query(`DROP TABLE "token"`)
    await db.query(`ALTER TABLE "token_balance" DROP CONSTRAINT "FK_5813c3040e74c285719679c6935"`)
  }
}
