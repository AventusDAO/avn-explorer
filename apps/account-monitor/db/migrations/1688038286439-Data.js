module.exports = class Data1688038286439 {
    name = 'Data1688038286439'

    async up(db) {
        await db.query(`CREATE TABLE "token" ("id" character varying NOT NULL, "name" text, "account_id" character varying, CONSTRAINT "PK_82fae97f905930df5d62a702fc9" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_6121d7a5eafbe71fba146a98fd" ON "token" ("account_id") `)
        await db.query(`CREATE TABLE "account" ("id" character varying NOT NULL, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`)
        await db.query(`CREATE TABLE "token_transfer" ("id" character varying NOT NULL, "block_number" integer NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "extrinsic_hash" text, "amount" numeric NOT NULL, "pallet" text NOT NULL, "method" text NOT NULL, "from_id" character varying, "to_id" character varying, "token_id" character varying, CONSTRAINT "PK_77384b7f5874553f012eba9da41" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_b47f7192b72dd8436ef4e6d253" ON "token_transfer" ("block_number") `)
        await db.query(`CREATE INDEX "IDX_752d6c330729a7b2e283003374" ON "token_transfer" ("timestamp") `)
        await db.query(`CREATE INDEX "IDX_2ef35b71d641ec79b7de3ac237" ON "token_transfer" ("extrinsic_hash") `)
        await db.query(`CREATE INDEX "IDX_f62ce2d807e8c6ce2651d2ebf9" ON "token_transfer" ("from_id") `)
        await db.query(`CREATE INDEX "IDX_f272327358edf76901e129ac31" ON "token_transfer" ("to_id") `)
        await db.query(`CREATE INDEX "IDX_aae50046f62ba400c07477fb6c" ON "token_transfer" ("amount") `)
        await db.query(`CREATE INDEX "IDX_4dbddd00fdedf513899e70cc68" ON "token_transfer" ("token_id") `)
        await db.query(`CREATE INDEX "IDX_fd34f0875f03cb0bc826b76984" ON "token_transfer" ("pallet") `)
        await db.query(`CREATE INDEX "IDX_71c1124eb609e2074ac69894a1" ON "token_transfer" ("method") `)
        await db.query(`CREATE TABLE "token_lookup" ("id" SERIAL NOT NULL, "token_id" text NOT NULL, "token_name" text NOT NULL, CONSTRAINT "PK_85cc52b0c9861e62d7d78df8d35" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_ed36cbc8debd00719e4a7ab3bb" ON "token_lookup" ("token_id") `)
        await db.query(`CREATE INDEX "IDX_bf8b69df15c998c17ac6c2ee3e" ON "token_lookup" ("token_name") `)
        await db.query(`ALTER TABLE "token" ADD CONSTRAINT "FK_6121d7a5eafbe71fba146a98fd3" FOREIGN KEY ("account_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "token_transfer" ADD CONSTRAINT "FK_f62ce2d807e8c6ce2651d2ebf97" FOREIGN KEY ("from_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "token_transfer" ADD CONSTRAINT "FK_f272327358edf76901e129ac317" FOREIGN KEY ("to_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "token_transfer" ADD CONSTRAINT "FK_4dbddd00fdedf513899e70cc681" FOREIGN KEY ("token_id") REFERENCES "token"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
    }

    async down(db) {
        await db.query(`DROP TABLE "token"`)
        await db.query(`DROP INDEX "public"."IDX_6121d7a5eafbe71fba146a98fd"`)
        await db.query(`DROP TABLE "account"`)
        await db.query(`DROP TABLE "token_transfer"`)
        await db.query(`DROP INDEX "public"."IDX_b47f7192b72dd8436ef4e6d253"`)
        await db.query(`DROP INDEX "public"."IDX_752d6c330729a7b2e283003374"`)
        await db.query(`DROP INDEX "public"."IDX_2ef35b71d641ec79b7de3ac237"`)
        await db.query(`DROP INDEX "public"."IDX_f62ce2d807e8c6ce2651d2ebf9"`)
        await db.query(`DROP INDEX "public"."IDX_f272327358edf76901e129ac31"`)
        await db.query(`DROP INDEX "public"."IDX_aae50046f62ba400c07477fb6c"`)
        await db.query(`DROP INDEX "public"."IDX_4dbddd00fdedf513899e70cc68"`)
        await db.query(`DROP INDEX "public"."IDX_fd34f0875f03cb0bc826b76984"`)
        await db.query(`DROP INDEX "public"."IDX_71c1124eb609e2074ac69894a1"`)
        await db.query(`DROP TABLE "token_lookup"`)
        await db.query(`DROP INDEX "public"."IDX_ed36cbc8debd00719e4a7ab3bb"`)
        await db.query(`DROP INDEX "public"."IDX_bf8b69df15c998c17ac6c2ee3e"`)
        await db.query(`ALTER TABLE "token" DROP CONSTRAINT "FK_6121d7a5eafbe71fba146a98fd3"`)
        await db.query(`ALTER TABLE "token_transfer" DROP CONSTRAINT "FK_f62ce2d807e8c6ce2651d2ebf97"`)
        await db.query(`ALTER TABLE "token_transfer" DROP CONSTRAINT "FK_f272327358edf76901e129ac317"`)
        await db.query(`ALTER TABLE "token_transfer" DROP CONSTRAINT "FK_4dbddd00fdedf513899e70cc681"`)
    }
}
