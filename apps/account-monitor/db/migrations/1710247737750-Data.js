module.exports = class Data1710247737750 {
    name = 'Data1710247737750'

    async up(db) {
        await db.query(`CREATE TABLE "transaction_event" ("id" character varying NOT NULL, "name" text NOT NULL, "args" jsonb NOT NULL, "extrinsic_hash" text NOT NULL, "extrinsic_index_in_block" numeric NOT NULL, "extrinsic_success" boolean NOT NULL, "extrinsic_block_number" numeric NOT NULL, CONSTRAINT "PK_1b4101c76f4a2c8168aeb8f3bad" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_e20c07fd4033e7a836da1e9c9a" ON "transaction_event" ("extrinsic_block_number") `)
    }

    async down(db) {
        await db.query(`DROP TABLE "transaction_event"`)
        await db.query(`DROP INDEX "public"."IDX_e20c07fd4033e7a836da1e9c9a"`)
    }
}
