module.exports = class Data1685120923996 {
    name = 'Data1685120923996'

    async up(db) {
        await db.query(`CREATE TABLE "extrinsic_error" ("id" character varying NOT NULL, "extrinsic_hash" text NOT NULL, "message" text NOT NULL, CONSTRAINT "PK_f7c84f1baeb8da919cc0a5685f3" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_5ce216798f1df63f2360463ec0" ON "extrinsic_error" ("extrinsic_hash") `)
    }

    async down(db) {
        await db.query(`DROP TABLE "extrinsic_error"`)
        await db.query(`DROP INDEX "public"."IDX_5ce216798f1df63f2360463ec0"`)
    }
}
