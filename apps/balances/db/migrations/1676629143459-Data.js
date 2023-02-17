module.exports = class Data1676629143459 {
    name = 'Data1676629143459'

    async up(db) {
        await db.query(`CREATE INDEX "IDX_cede9799c921bc6d70a3622593" ON "chain_state" ("token_balance") `)
        await db.query(`CREATE INDEX "IDX_b9d3525bd7a1a1cd7396b432e6" ON "chain_state" ("token_holders") `)
        await db.query(`CREATE INDEX "IDX_19db84bc745a8f554d08b200ba" ON "balance" ("free") `)
        await db.query(`CREATE INDEX "IDX_8c860533f3e06c7296f87d1703" ON "balance" ("reserved") `)
        await db.query(`CREATE INDEX "IDX_7092d98388624da7325a1e43ee" ON "balance" ("total") `)
        await db.query(`CREATE INDEX "IDX_308939c7ca893ce112a02ba0ba" ON "balance" ("updated_at") `)
        await db.query(`CREATE INDEX "IDX_08a76919ccd3887911dd30b911" ON "balance" ("account_id") `)
    }

    async down(db) {
        await db.query(`DROP INDEX "public"."IDX_cede9799c921bc6d70a3622593"`)
        await db.query(`DROP INDEX "public"."IDX_b9d3525bd7a1a1cd7396b432e6"`)
        await db.query(`DROP INDEX "public"."IDX_19db84bc745a8f554d08b200ba"`)
        await db.query(`DROP INDEX "public"."IDX_8c860533f3e06c7296f87d1703"`)
        await db.query(`DROP INDEX "public"."IDX_7092d98388624da7325a1e43ee"`)
        await db.query(`DROP INDEX "public"."IDX_308939c7ca893ce112a02ba0ba"`)
        await db.query(`DROP INDEX "public"."IDX_08a76919ccd3887911dd30b911"`)
    }
}
