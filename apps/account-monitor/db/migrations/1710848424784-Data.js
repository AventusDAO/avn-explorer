module.exports = class Data1710848424784 {
    name = 'Data1710848424784'

    async up(db) {
        await db.query(`CREATE TABLE "cross_chain_transaction_event" ("id" character varying NOT NULL, "name" text NOT NULL, "args" jsonb NOT NULL, "eth_event_id_signature" text NOT NULL, "eth_event_id_transaction_hash" text NOT NULL, "extrinsic_hash" text NOT NULL, "extrinsic_index_in_block" numeric NOT NULL, "extrinsic_success" boolean NOT NULL, "extrinsic_block_number" numeric NOT NULL, CONSTRAINT "PK_86c25a60589fcaee59b057f93cf" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_7e2b7ce6d50fdb52b0d8464acb" ON "cross_chain_transaction_event" ("extrinsic_block_number") `)

        await db.query(`GRANT USAGE ON SCHEMA public To readonly`) 
        await db.query(`GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly`) 
        await db.query(`GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO readonly`) 
 
        await db.query(`GRANT USAGE ON SCHEMA public To explorer_ro`) 
        await db.query(`GRANT SELECT ON ALL TABLES IN SCHEMA public TO explorer_ro`) 
        await db.query(`GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO explorer_ro`)
    }

    async down(db) {
        await db.query(`DROP TABLE "cross_chain_transaction_event"`)
        await db.query(`DROP INDEX "public"."IDX_7e2b7ce6d50fdb52b0d8464acb"`)
    }
}
