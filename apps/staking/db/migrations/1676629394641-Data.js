module.exports = class Data1676629394641 {
    name = 'Data1676629394641'

    async up(db) {
        await db.query(`CREATE INDEX "IDX_83720c7794d1eb71f9db042d48" ON "account" ("staked_amount_total") `)
        await db.query(`CREATE INDEX "IDX_5392f7fefc25be3b09cc9acecd" ON "account" ("rewards_total") `)
        await db.query(`CREATE INDEX "IDX_8bed31488e09ed64770378600b" ON "account" ("updated_at") `)
    }

    async down(db) {
        await db.query(`DROP INDEX "public"."IDX_83720c7794d1eb71f9db042d48"`)
        await db.query(`DROP INDEX "public"."IDX_5392f7fefc25be3b09cc9acecd"`)
        await db.query(`DROP INDEX "public"."IDX_8bed31488e09ed64770378600b"`)
    }
}
