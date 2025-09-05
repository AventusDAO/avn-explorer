module.exports = class Data1756876956986 {
    name = 'Data1756876956986'

    async up(db) {
        await db.query(`CREATE TABLE "block_transaction_count" ("id" character varying NOT NULL, "block_number" numeric NOT NULL, "block_timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "total_signed_transactions" integer NOT NULL, CONSTRAINT "PK_71ce71e8078c64465ce481bd751" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_5844c7dfdacdda0f00fc9ddabb" ON "block_transaction_count" ("block_number") `)
        await db.query(`CREATE INDEX "IDX_9ac069552a6988066eb77a29f5" ON "block_transaction_count" ("block_timestamp") `)

        // await db.query(`GRANT USAGE ON SCHEMA public To readonly`)
        // await db.query(`GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly`)
        // await db.query(`GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO readonly`) 

        // await db.query(`GRANT USAGE ON SCHEMA public To explorer_ro`)
        // await db.query(`GRANT SELECT ON ALL TABLES IN SCHEMA public TO explorer_ro`)
        // await db.query(`GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO explorer_ro`)
    }

    async down(db) {
        await db.query(`DROP TABLE "block_transaction_count"`)
        await db.query(`DROP INDEX "public"."IDX_5844c7dfdacdda0f00fc9ddabb"`)
        await db.query(`DROP INDEX "public"."IDX_9ac069552a6988066eb77a29f5"`)
    }
}
