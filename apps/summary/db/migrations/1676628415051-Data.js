module.exports = class Data1676628415051 {
    name = 'Data1676628415051'

    async up(db) {
        await db.query(`CREATE INDEX "IDX_8bbeac0d120d9676630e291e97" ON "summary_root" ("root_hash") `)
        await db.query(`CREATE INDEX "IDX_7d6bf443cb7d09382d9a7e76f1" ON "summary_root" ("is_validated") `)
    }

    async down(db) {
        await db.query(`DROP INDEX "public"."IDX_8bbeac0d120d9676630e291e97"`)
        await db.query(`DROP INDEX "public"."IDX_7d6bf443cb7d09382d9a7e76f1"`)
    }
}
