module.exports = class Data1740400406822 {
    name = 'Data1740400406822'

    async up(db) {
        await db.query(`CREATE TABLE "reward" ("id" character varying NOT NULL, "reward_period" numeric NOT NULL, "amount" numeric NOT NULL, "block_timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "owner_id" character varying, "node_id" character varying, CONSTRAINT "PK_a90ea606c229e380fb341838036" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_4570337d73f6ec880f2b232aec" ON "reward" ("owner_id") `)
        await db.query(`CREATE INDEX "IDX_723501461189acd1a9a8ca043a" ON "reward" ("node_id") `)
        await db.query(`CREATE TABLE "node" ("id" character varying NOT NULL, "block_timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "owner_id" character varying, CONSTRAINT "PK_8c8caf5f29d25264abe9eaf94dd" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_8ffa491fa96eb26764dcf9a81f" ON "node" ("owner_id") `)
        await db.query(`CREATE TABLE "account" ("id" character varying NOT NULL, CONSTRAINT "PK_54115ee388cdb6d86bb4bf5b2ea" PRIMARY KEY ("id"))`)
        await db.query(`ALTER TABLE "reward" ADD CONSTRAINT "FK_4570337d73f6ec880f2b232aec6" FOREIGN KEY ("owner_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "reward" ADD CONSTRAINT "FK_723501461189acd1a9a8ca043ad" FOREIGN KEY ("node_id") REFERENCES "node"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)
        await db.query(`ALTER TABLE "node" ADD CONSTRAINT "FK_8ffa491fa96eb26764dcf9a81fd" FOREIGN KEY ("owner_id") REFERENCES "account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`)

        await db.query(`GRANT USAGE ON SCHEMA public To readonly`)
        await db.query(`GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly`)
        await db.query(`GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO readonly`)

        await db.query(`GRANT USAGE ON SCHEMA public To explorer_ro`)
        await db.query(`GRANT SELECT ON ALL TABLES IN SCHEMA public TO explorer_ro`)
        await db.query(`GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO explorer_ro`)

        await db.query(`GRANT USAGE ON SCHEMA squid_processor To readonly`)
        await db.query(`GRANT SELECT ON ALL TABLES IN SCHEMA squid_processor TO readonly`)
        await db.query(`GRANT SELECT ON ALL SEQUENCES IN SCHEMA squid_processor TO readonly`)

        await db.query(`GRANT USAGE ON SCHEMA squid_processor To explorer_ro`)
        await db.query(`GRANT SELECT ON ALL TABLES IN SCHEMA squid_processor TO explorer_ro`)
        await db.query(`GRANT SELECT ON ALL SEQUENCES IN SCHEMA squid_processor TO explorer_ro`)
    }

    async down(db) {
        await db.query(`DROP TABLE "reward"`)
        await db.query(`DROP INDEX "public"."IDX_4570337d73f6ec880f2b232aec"`)
        await db.query(`DROP INDEX "public"."IDX_723501461189acd1a9a8ca043a"`)
        await db.query(`DROP TABLE "node"`)
        await db.query(`DROP INDEX "public"."IDX_8ffa491fa96eb26764dcf9a81f"`)
        await db.query(`DROP TABLE "account"`)
        await db.query(`ALTER TABLE "reward" DROP CONSTRAINT "FK_4570337d73f6ec880f2b232aec6"`)
        await db.query(`ALTER TABLE "reward" DROP CONSTRAINT "FK_723501461189acd1a9a8ca043ad"`)
        await db.query(`ALTER TABLE "node" DROP CONSTRAINT "FK_8ffa491fa96eb26764dcf9a81fd"`)
    }
}
