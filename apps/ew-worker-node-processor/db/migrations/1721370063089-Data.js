module.exports = class Data1721370063089 {
    name = 'Data1721370063089'

    async up(db) {
        await db.query(`CREATE TABLE "solution_group" ("id" character varying NOT NULL, "voting_reward" numeric, "subscription_reward" numeric, "unclaimed_rewards" numeric, "remaining_blocks" integer, "reserved_funds" numeric, CONSTRAINT "PK_8d14480e5f119727a42ac0119a7" PRIMARY KEY ("id"))`)
    }

    async down(db) {
        await db.query(`DROP TABLE "solution_group"`)
    }
}
