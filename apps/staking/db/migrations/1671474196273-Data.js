module.exports = class Data1671474196273 {
    name = 'Data1671474196273'

    async up(db) {
        await db.query(`ALTER TABLE "account" ADD "total_rewards" numeric NOT NULL`)
        await db.query(`ALTER TABLE "account" ALTER COLUMN "staked_amount" TYPE numeric`)
    }

    async down(db) {
        await db.query(`ALTER TABLE "account" DROP COLUMN "total_rewards"`)
        await db.query(`ALTER TABLE "account" ALTER COLUMN "staked_amount" TYPE numeric(80,0)`)
    }
}
