module.exports = class Data1685434764582 {
    name = 'Data1685434764582'

    async up(db) {
        await db.query(`CREATE TABLE "extrinsic_error" ("id" character varying NOT NULL, "extrinsic_hash" text NOT NULL, "message" text NOT NULL, CONSTRAINT "PK_f7c84f1baeb8da919cc0a5685f3" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_5ce216798f1df63f2360463ec0" ON "extrinsic_error" ("extrinsic_hash") `)
        await db.query(`CREATE TABLE "chain_state" ("id" character varying NOT NULL, "timestamp" TIMESTAMP WITH TIME ZONE NOT NULL, "block_number" integer NOT NULL, CONSTRAINT "PK_e28e46a238ada7cbbcf711b3f6c" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_b15977afb801d90143ea51cdec" ON "chain_state" ("timestamp") `)
        await db.query(`CREATE INDEX "IDX_5596acea2cba293bbdc32b577c" ON "chain_state" ("block_number") `)
    }

    async down(db) {
        await db.query(`DROP TABLE "extrinsic_error"`)
        await db.query(`DROP INDEX "public"."IDX_5ce216798f1df63f2360463ec0"`)
        await db.query(`DROP TABLE "chain_state"`)
        await db.query(`DROP INDEX "public"."IDX_b15977afb801d90143ea51cdec"`)
        await db.query(`DROP INDEX "public"."IDX_5596acea2cba293bbdc32b577c"`)
    }
}
