module.exports = class Data1689074753890 {
    name = 'Data1689074753890'

    async up(db) {
        await db.query(`CREATE TABLE "extrinsic_error" ("id" character varying NOT NULL, "extrinsic_hash" text NOT NULL, "error_name" text NOT NULL, CONSTRAINT "PK_f7c84f1baeb8da919cc0a5685f3" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_5ce216798f1df63f2360463ec0" ON "extrinsic_error" ("extrinsic_hash") `)
        
        await db.query(`GRANT USAGE ON SCHEMA public To readonly`)
        await db.query(`GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly`)
        await db.query(`GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO readonly`)
    }

    async down(db) {
        await db.query(`DROP TABLE "extrinsic_error"`)
        await db.query(`DROP INDEX "public"."IDX_5ce216798f1df63f2360463ec0"`)
    }
}
