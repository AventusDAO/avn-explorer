module.exports = class Data1676551807169 {
    name = 'Data1676551807169'

    async up(db) {
        await db.query(`ALTER TABLE "summary_root" ALTER COLUMN "to_block" SET NOT NULL`)
        await db.query(`CREATE INDEX "IDX_e0031992d80f4f1b366ccc6aa1" ON "summary_root" ("from_block") `)
        await db.query(`CREATE INDEX "IDX_30af57b3b2345bc08658453488" ON "summary_root" ("to_block") `)
    }

    async down(db) {
        await db.query(`ALTER TABLE "summary_root" ALTER COLUMN "to_block" DROP NOT NULL`)
        await db.query(`DROP INDEX "public"."IDX_e0031992d80f4f1b366ccc6aa1"`)
        await db.query(`DROP INDEX "public"."IDX_30af57b3b2345bc08658453488"`)
    }
}
