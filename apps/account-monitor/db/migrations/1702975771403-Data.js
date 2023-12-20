module.exports = class Data1702975771403 {
    name = 'Data1702975771403'

    async up(db) {
        await db.query(`CREATE TABLE "scheduled_lower_transaction" ("id" character varying NOT NULL, "name" text NOT NULL, "scheduled_transaction_name" text NOT NULL, "from" text, "amount" numeric, "lower_id" integer, "token_id" text, "t1_recipient" text, CONSTRAINT "PK_87cdcdc562fc5aa966fc473d42f" PRIMARY KEY ("id"))`)

        //         await db.query(`GRANT USAGE ON SCHEMA public To readonly`)
        // await db.query(`GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly`)
        // await db.query(`GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO readonly`)
    }

    async down(db) {
        await db.query(`DROP TABLE "scheduled_lower_transaction"`)
    }
}
