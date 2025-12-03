module.exports = class Data1720709674892 {
    name = 'Data1720709674892'

    async up(db) {
        await db.query(`CREATE TABLE "token_example" ("id" character varying NOT NULL, CONSTRAINT "PK_def236c725178da13a4ccf41a4d" PRIMARY KEY ("id"))`)
    }

    async down(db) {
        await db.query(`DROP TABLE "token_example"`)
    }
}
