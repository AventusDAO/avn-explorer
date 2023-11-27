module.exports = class Data1676628712145 {
    name = 'Data1676628712145'

    async up(db) {
        await db.query(`CREATE INDEX "IDX_1dbd6d7b34c9731403609655fe" ON "account" ("fees_total") `)
        await db.query(`CREATE INDEX "IDX_8bed31488e09ed64770378600b" ON "account" ("updated_at") `)

        await db.query(`GRANT USAGE ON SCHEMA public To readonly`)
        await db.query(`GRANT SELECT ON ALL TABLES IN SCHEMA public TO readonly`)
        await db.query(`GRANT SELECT ON ALL SEQUENCES IN SCHEMA public TO readonly`)
    }

    async down(db) {
        await db.query(`DROP INDEX "public"."IDX_1dbd6d7b34c9731403609655fe"`)
        await db.query(`DROP INDEX "public"."IDX_8bed31488e09ed64770378600b"`)
    }
}
