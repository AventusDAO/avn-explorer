module.exports = class Data1763118344430 {
    name = 'Data1763118344430'

    async up(db) {
        await db.query(`CREATE TABLE "alert" ("id" character varying NOT NULL, "alert_message" text NOT NULL, "is_warning" boolean NOT NULL, "is_error" boolean NOT NULL, "expire_at" TIMESTAMP WITH TIME ZONE NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_ad91cad659a3536465d564a4b2f" PRIMARY KEY ("id"))`)
        await db.query(`CREATE INDEX "IDX_a0df2d8ab0f3f9505ff57bbfe3" ON "alert" ("alert_message") `)
        await db.query(`CREATE INDEX "IDX_f19c95322f554543f944f186de" ON "alert" ("is_warning") `)
        await db.query(`CREATE INDEX "IDX_2414a921433875a3c9c1ed959b" ON "alert" ("is_error") `)
        await db.query(`CREATE INDEX "IDX_4cc3d81e21362d350ea1e9ae4a" ON "alert" ("expire_at") `)
    }

    async down(db) {
        await db.query(`DROP TABLE "alert"`)
        await db.query(`DROP INDEX "public"."IDX_a0df2d8ab0f3f9505ff57bbfe3"`)
        await db.query(`DROP INDEX "public"."IDX_f19c95322f554543f944f186de"`)
        await db.query(`DROP INDEX "public"."IDX_2414a921433875a3c9c1ed959b"`)
        await db.query(`DROP INDEX "public"."IDX_4cc3d81e21362d350ea1e9ae4a"`)
    }
}
