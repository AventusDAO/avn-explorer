module.exports = class Data1768467969408 {
    name = 'Data1768467969408'

    async up(db) {
        await db.query(`ALTER TABLE "alert" ADD "alert_type" text NOT NULL`)
        await db.query(`ALTER TABLE "alert" ADD "source_identifier" text NOT NULL`)
        await db.query(`CREATE INDEX "IDX_417891fd39353a6a32697492df" ON "alert" ("alert_type") `)
        await db.query(`CREATE INDEX "IDX_7ef11412a51277294c264e8b1b" ON "alert" ("source_identifier") `)
    }

    async down(db) {
        await db.query(`ALTER TABLE "alert" DROP COLUMN "alert_type"`)
        await db.query(`ALTER TABLE "alert" DROP COLUMN "source_identifier"`)
        await db.query(`DROP INDEX "public"."IDX_417891fd39353a6a32697492df"`)
        await db.query(`DROP INDEX "public"."IDX_7ef11412a51277294c264e8b1b"`)
    }
}
