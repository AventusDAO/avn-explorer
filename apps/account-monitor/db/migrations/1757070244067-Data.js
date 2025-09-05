module.exports = class Data1757070244067 {
    name = 'Data1757070244067'

    async up(db) {
        await db.query(`CREATE TABLE "block_transaction_total" ("id" character varying NOT NULL, "total_signed_transactions" integer NOT NULL, CONSTRAINT "PK_8828577fdc871355253295a8e3d" PRIMARY KEY ("id"))`)

        await db.query(`GRANT USAGE ON SCHEMA public To readonly`)
        await db.query(`GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly`)
        await db.query(`GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO readonly`) 

        await db.query(`GRANT USAGE ON SCHEMA public To explorer_ro`)
        await db.query(`GRANT SELECT ON ALL TABLES IN SCHEMA public TO explorer_ro`)
        await db.query(`GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO explorer_ro`)
    }

    async down(db) {
        await db.query(`DROP TABLE "block_transaction_total"`)
    }
}
