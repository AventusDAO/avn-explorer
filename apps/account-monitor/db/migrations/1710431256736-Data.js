module.exports = class Data1710431256736 {
    name = 'Data1710431256736'

    async up(db) {
        await db.query(`CREATE TABLE "transaction_event" ("id" character varying NOT NULL, "name" text NOT NULL, "args" jsonb NOT NULL, "eth_event_id_signature" text NOT NULL, "eth_event_id_transaction_hash" text NOT NULL, "extrinsic_hash" text NOT NULL, "extrinsic_index_in_block" numeric NOT NULL, "extrinsic_success" boolean NOT NULL, "extrinsic_block_number" numeric NOT NULL, CONSTRAINT "PK_1b4101c76f4a2c8168aeb8f3bad" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_e20c07fd4033e7a836da1e9c9a" ON "transaction_event" ("extrinsic_block_number") `)

        await db.query(`GRANT USAGE ON SCHEMA public To readonly`) 
        await db.query(`GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly`) 
        await db.query(`GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO readonly`) 
 
        await db.query(`GRANT USAGE ON SCHEMA public To explorer_ro`) 
        await db.query(`GRANT SELECT ON ALL TABLES IN SCHEMA public TO explorer_ro`) 
        await db.query(`GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO explorer_ro`)
    }

    async down(db) {
        await db.query(`DROP TABLE "transaction_event"`)
        await db.query(`DROP INDEX "public"."IDX_e20c07fd4033e7a836da1e9c9a"`)
    }
}
